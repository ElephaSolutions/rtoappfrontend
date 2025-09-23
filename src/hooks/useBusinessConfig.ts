
import { useEffect, useState } from 'react';

interface BusinessTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface BusinessConfig {
  logo: string;
  brandName: string;
  theme: BusinessTheme;
}

export const useBusinessConfig = () => {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const client = urlParams.get('client') || 'default';
        
        const response = await fetch('/config.json');
        const allConfigs = await response.json();
        
        const businessConfig = allConfigs[client] || allConfigs['default'];
        setConfig(businessConfig);
        
        // Apply theme colors to CSS variables
        if (businessConfig?.theme) {
          const root = document.documentElement;
          root.style.setProperty('--color-primary', businessConfig.theme.primary);
          root.style.setProperty('--color-secondary', businessConfig.theme.secondary);
          root.style.setProperty('--color-accent', businessConfig.theme.accent);
          root.style.setProperty('--color-bg', businessConfig.theme.background);
        }
      } catch (error) {
        console.error('Failed to load business config:', error);
        // Fallback to default
        setConfig({
          logo: "/logos/default.png",
          brandName: "Vehicle Records",
          theme: {
            primary: "#2563EB",
            secondary: "#3B82F6", 
            accent: "#059669",
            background: "#F8FAFC"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading };
};
