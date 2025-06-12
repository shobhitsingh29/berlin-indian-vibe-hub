import { createContext, useContext, useEffect, useState } from 'react';
import { Configuration } from '../types/config';
import { ConfigService } from '../services/api/config';

interface ConfigContextType {
    config: Configuration | null;
    isLoading: boolean;
    error: string | null;
    refreshConfig: () => void;
    getConfigValue: (key: string) => any;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<Configuration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const configService = ConfigService.getInstance();

    const refreshConfig = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const configData = await configService.fetchConfig();
            setConfig(configData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const getConfigValue = (key: string) => {
        if (!config) return null;
        return config[key];
    };

    useEffect(() => {
        refreshConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ 
            config,
            isLoading,
            error,
            refreshConfig,
            getConfigValue
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

export default ConfigProvider;
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
