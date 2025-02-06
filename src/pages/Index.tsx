import { useQuery } from "@tanstack/react-query";
import VideoUploader from "@/components/VideoUploader";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await supabase.storage.from("videos").list();
      return data || [];
    },
  });

  return (
    <div className="container mx-auto p-4">
      <VideoUploader />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
        {isLoading ? (
          <div>Loading videos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos?.map((video) => (
              <div key={video.id} className="border rounded-lg overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <video
                    src={`${supabase.storage.from("videos").getPublicUrl(video.name).data.publicUrl}`}
                    controls
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{video.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;