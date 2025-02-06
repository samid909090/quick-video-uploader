import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const VideoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a video file"
      });
      return;
    }

    setSelectedVideo(file);
    toast({
      title: "Video selected",
      description: `Selected: ${file.name}`
    });
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please select a video first"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress for now
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      toast({
        title: "Success",
        description: "Video selected successfully! Upload feature coming soon."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process video"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedVideo(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Upload Video</h2>
          <p className="text-gray-500">Select a video file to upload</p>
        </div>

        <div className="space-y-4">
          <label className="relative block">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
              disabled={isUploading}
            />
            <Button 
              variant="outline"
              size="lg"
              className={`w-full h-32 border-2 border-dashed border-blue-300 hover:border-blue-500 
                ${isUploading ? 'animate-pulse bg-blue-50' : 'hover:bg-blue-50'}`}
              disabled={isUploading}
            >
              <div className="flex flex-col items-center space-y-2">
                {selectedVideo ? (
                  <Video className="w-8 h-8 text-blue-500" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-500" />
                )}
                <span className="text-sm text-gray-600">
                  {selectedVideo ? selectedVideo.name : 'Choose Video'}
                </span>
              </div>
            </Button>
          </label>

          {selectedVideo && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;