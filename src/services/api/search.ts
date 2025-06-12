import { Event, EventFilters } from '@/types/event';
import { ConfigService } from './config';

export class SearchService {
    private static instance: SearchService;
    private configService: ConfigService;

    private constructor() {
        this.configService = ConfigService.getInstance();
    }

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService();
        }
        return SearchService.instance;
    }

    async searchEvents(filters: EventFilters): Promise<{ data: Event[], meta: { total: number, page: number, limit: number, totalPages: number } }> {
        try {
            const config = await this.configService.getConfig();
            const apiUrl = `${config.apiBaseUrl}/events/search`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(filters)
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching events:', error);
            throw error;
        }
    }

    async getSearchFilters(): Promise<{ fields: string[], sortOptions: string[] }> {
        try {
            const config = await this.configService.getConfig();
            // Get search filters from backend configuration
            const searchConfig = config.searchFilters || {
                fields: ['title', 'description', 'location', 'category', 'date'],
                sortOptions: ['date', 'title', 'price']
            };
            
            // Validate the configuration
            if (!Array.isArray(searchConfig.fields) || !Array.isArray(searchConfig.sortOptions)) {
                throw new Error('Invalid search filters configuration');
            }
            
            return searchConfig;
        } catch (error) {
            console.error('Error getting search filters:', error);
            // Fallback to default configuration if backend config fails
            return {
                fields: ['title', 'description', 'location', 'category', 'date'],
                sortOptions: ['date', 'title', 'price']
            };
        }
    }
}
