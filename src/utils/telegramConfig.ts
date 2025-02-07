
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TelegramConfig {
  apiId: string;
  apiHash: string;
  serverUrl: string;
}

export const useTelegramConfig = () => {
  return useQuery({
    queryKey: ["telegram-config"],
    queryFn: async (): Promise<TelegramConfig | null> => {
      const { data, error } = await supabase
        .from("telegram_configs")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching Telegram config:", error);
        return null;
      }

      return {
        apiId: data.api_id,
        apiHash: data.api_hash,
        serverUrl: data.server_url,
      };
    },
  });
};

export const validateTelegramCredentials = (config: TelegramConfig | null) => {
  return config?.apiId && config?.apiHash && config?.serverUrl;
};
