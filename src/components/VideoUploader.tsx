
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useTelegramConfig } from "@/utils/telegramConfig";
import { useQueryClient } from "@tanstack/react-query";

const VideoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { data: telegramConfig, isLoading: isConfigLoading } = useTelegramConfig();
  const queryClient = useQueryClient();
  
  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "अमान्य फ़ाइल प्रकार",
        description: "कृपया एक वीडियो फ़ाइल चुनें"
      });
      return;
    }

    setSelectedVideo(file);
    toast({
      title: "वीडियो चयनित",
      description: `चयनित: ${file.name}`
    });
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      toast({
        variant: "destructive",
        title: "कोई वीडियो नहीं चुना गया",
        description: "कृपया पहले एक वीडियो चुनें"
      });
      return;
    }

    if (!telegramConfig) {
      toast({
        variant: "destructive",
        title: "टेलीग्राम कॉन्फ़िगरेशन त्रुटि",
        description: "टेलीग्राम कॉन्फ़िगरेशन लोड नहीं हो सका"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // First upload to Supabase for temporary storage
      const fileExt = selectedVideo.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedVideo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Now upload to Telegram using MTProto server
      const formData = new FormData();
      formData.append('file', selectedVideo);
      formData.append('api_id', telegramConfig.apiId);
      formData.append('api_hash', telegramConfig.apiHash);

      const response = await fetch(`https://${telegramConfig.serverUrl}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload to Telegram');
      }

      const telegramResponse = await response.json();

      if (telegramResponse.ok) {
        toast({
          title: "सफलता",
          description: "वीडियो टेलीग्राम पर सफलतापूर्वक अपलोड किया गया!"
        });

        // Refresh the videos list
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      } else {
        throw new Error(telegramResponse.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "त्रुटि",
        description: "वीडियो अपलोड करने में विफल: " + (error.message || 'Unknown error')
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedVideo(null);
    }
  };

  const openGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.capture = 'environment';
    input.multiple = false;
    
    input.onchange = (e) => handleVideoSelect(e as unknown as React.ChangeEvent<HTMLInputElement>);
    
    input.click();
  };

  if (isConfigLoading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">वीडियो अपलोड करें</h2>
          <p className="text-gray-500">अपलोड करने के लिए एक वीडियो फ़ाइल चुनें</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline"
            size="lg"
            className={`w-full h-32 border-2 border-dashed border-blue-300 hover:border-blue-500 
              ${isUploading ? 'animate-pulse bg-blue-50' : 'hover:bg-blue-50'}`}
            disabled={isUploading}
            onClick={openGallery}
          >
            <div className="flex flex-col items-center space-y-2">
              {selectedVideo ? (
                <Video className="w-8 h-8 text-blue-500" />
              ) : (
                <Upload className="w-8 h-8 text-blue-500" />
              )}
              <span className="text-sm text-gray-600">
                {selectedVideo ? selectedVideo.name : 'वीडियो चुनें'}
              </span>
            </div>
          </Button>

          {selectedVideo && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'अपलोड हो रहा है...' : 'वीडियो अपलोड करें'}
            </Button>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                अपलोड हो रहा है: {uploadProgress.toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
