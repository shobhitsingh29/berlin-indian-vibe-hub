import { Event, EventFilters } from '@/types/event';
import { ConfigService } from './config';

const DEFAULT_API_URL = 'http://localhost:3001/api';
const DEFAULT_SEARCH_FILTERS = {
    fields: ['title', 'description', 'location', 'category', 'date'],
    sortOptions: ['date', 'title', 'price']
};

export class SearchService {
    private static instance: SearchService;
    private configService: ConfigService;
    private config: any = null;

    private constructor() {
        this.configService = ConfigService.getInstance();
        this.initializeConfig();
    }

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService();
        }
        return SearchService.instance;
    }

    private async initializeConfig() {
        try {
            this.config = await this.configService.fetchConfig();
        } catch (error) {
            console.error('Failed to initialize config:', error);
            this.config = { apiBaseUrl: DEFAULT_API_URL };
        }
    }

    private getApiUrl(): string {
        return this.config?.apiBaseUrl || DEFAULT_API_URL;
    }

    async searchEvents(filters: EventFilters): Promise<{ 
        data: Event[], 
        meta: { total: number, page: number, limit: number, totalPages: number } 
    }> {
        try {
            // Ensure config is loaded
            if (!this.config) {
                await this.initializeConfig();
            }

            const apiUrl = `${this.getApiUrl()}/events/search`;
            
            // Transform dateRange to separate startDate/endDate for backend
            const { dateRange, ...restFilters } = filters;
            const requestBody = {
                ...restFilters,
                ...(dateRange ? {
                    startDate: dateRange.start,
                    endDate: dateRange.end
                } : {})
            };

            console.log('Search request to:', apiUrl, 'with body:', requestBody);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Search failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error in searchEvents:', error);
            // Return empty results on error
            return { 
                data: [], 
                meta: { 
                    total: 0, 
                    page: 1, 
                    limit: filters.limit || 10, 
                    totalPages: 0 
                } 
            };
        }
    }

    async getSearchFilters(): Promise<{ fields: string[], sortOptions: string[] }> {
        try {
            // Ensure config is loaded
            if (!this.config) {
                await this.initializeConfig();
            }
            
            // Get search filters from config or use defaults
            const searchConfig = this.config?.searchFilters || DEFAULT_SEARCH_FILTERS;
            
            // Validate the configuration
            if (!searchConfig || !Array.isArray(searchConfig.fields) || !Array.isArray(searchConfig.sortOptions)) {
                console.warn('Invalid search filters configuration, using defaults');
                return { ...DEFAULT_SEARCH_FILTERS };
            }
            
            return { ...searchConfig };
        } catch (error) {
            console.error('Error in getSearchFilters:', error);
            return { ...DEFAULT_SEARCH_FILTERS };
        }
    }
}
