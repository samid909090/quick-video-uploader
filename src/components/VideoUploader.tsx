import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

const VideoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a video file"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Here we'll implement the Telegram upload logic in the next iteration
      toast({
        title: "Success",
        description: "Video upload feature coming soon!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload video"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md p-8 space-y-4 text-center">
        <label className="relative">
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
              <Upload className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-600">
                {isUploading ? 'Uploading...' : 'Choose Video'}
              </span>
            </div>
          </Button>
        </label>
      </div>
    </div>
  );
};

export default VideoUploader;