export interface AppConfig {
  maintenanceDateEnd: string;
  customer: string;
  config: {
    gtmKey: boolean;
    builderApiKey: string;
    language?: 'en-GB' | 'nl-NL';
    phoneNumber?: string;
    email?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
}

let currentAppConfig: AppConfig | null = null;

export function setGlobalAppConfig(config: AppConfig | null) {
  currentAppConfig = config;
}

export function getMaintenanceDateEnd(): string {
  return process.env.NEXT_PUBLIC_MAINTENANCE_DATE_END || '';
}

export function useAppConfig(): AppConfig | null {
  return currentAppConfig;
}

export function getCustomerConfigs(): AppConfig[] {
  try {
    const configString = process.env.CUSTOMER_CONFIGS;
    
    if (!configString) {
      console.warn('CUSTOMER_CONFIGS environment variable not found');
      return [];
    }
    
    const configs = JSON.parse(configString);
    return configs.map((config: Omit<AppConfig, 'maintenanceDateEnd'>) => ({
      ...config
    }));
  } catch (error) {
    console.error('Error parsing customer configs:', error);
    return [];
  }
}

export function getCustomerConfig(customerName: string): AppConfig | null {
  const configs = getCustomerConfigs();
  return configs.find(
    config => config.customer.toLowerCase() === customerName.toLowerCase()
  ) || null;
}
