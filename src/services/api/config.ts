import { Configuration } from '@/types/config';

export interface ConfigResponse extends Configuration {
    lastUpdated: string;
    minTitleLength: number;
    maxTitleLength: number;
    minDescriptionLength: number;
    maxDescriptionLength: number;
    eventCategories: string[];
}

export class ConfigService {
    private static instance: ConfigService;
    private config: ConfigResponse | null = null;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    async fetchConfig(): Promise<ConfigResponse> {
        if (this.config) {
            return this.config;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/config`);
            if (!response.ok) {
                throw new Error('Failed to fetch configuration');
            }
            const data = await response.json();
            this.config = data;
            return data;
        } catch (error) {
            console.error('Error fetching config:', error);
            throw error;
        }
    }

    getConfig(): ConfigResponse | null {
        return this.config;
    }

    clearConfig(): void {
        this.config = null;
    }
}
