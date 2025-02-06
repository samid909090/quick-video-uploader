export const TELEGRAM_CONFIG = {
  apiId: "", // Will be filled by user
  apiHash: "", // Will be filled by user
  serverUrl: "149.154.167.50:443" // Production server from your config
};

export const validateTelegramCredentials = () => {
  return TELEGRAM_CONFIG.apiId && TELEGRAM_CONFIG.apiHash;
};