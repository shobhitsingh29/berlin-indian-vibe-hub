import { Configuration } from '@/types/config';

// Extend the base Configuration type with our additional fields
type ExtendedConfig = Configuration & {
    lastUpdated: string;
    searchFilters?: {
        fields: string[];
        sortOptions: string[];
    };
};

const DEFAULT_CONFIG: ExtendedConfig = {
    // Required Configuration fields
    apiBaseUrl: 'http://localhost:3001/api',
    version: '1.0.0',
    eventCategories: ['Music', 'Food', 'Art', 'Sports', 'Technology'],
    eventStatuses: ['draft', 'published', 'cancelled'],
    timeFormat: 'HH:mm',
    dateFormat: 'yyyy-MM-dd',
    minPrice: 0,
    maxPrice: 1000,
    currencySymbol: '€',
    maxTickets: 1000,
    minTickets: 1,
    defaultLocation: 'Berlin, Germany',
    imageUploadSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    minTitleLength: 3,
    maxTitleLength: 100,
    minDescriptionLength: 10,
    maxDescriptionLength: 5000,
    maxImagesPerPost: 10,
    maxImageSize: 5 * 1024 * 1024,
    validImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    
    // UI Text
    loginMessage: 'Please log in to continue',
    loginButtonText: 'Log In',
    postPrompt: 'Share your event',
    postPlaceholder: 'What\'s happening?',
    addPhotoButtonText: 'Add Photo',
    postButtonText: 'Post',
    searchPlaceholder: 'Search events...',
    filtersButtonText: 'Filters',
    eventLabel: 'Event',
    clearFiltersButtonText: 'Clear Filters',
    searchBadgeText: 'Search',
    categoryBadgeText: 'Category',
    locationBadgeText: 'Location',
    dateRangeBadgeText: 'Date Range',
    categoryLabel: 'Category',
    categoryPlaceholder: 'Select a category',
    allCategoriesText: 'All Categories',
    locationLabel: 'Location',
    dateRangeLabel: 'Date Range',
    pageTitle: 'Events',
    thisWeekButtonText: 'This Week',
    nearMeButtonText: 'Near Me',
    retryButtonText: 'Retry',
    loadingSkeletonCount: 6,
    compactEventCards: false,
    
    // Our additional fields
    lastUpdated: new Date().toISOString(),
    searchFilters: {
        fields: ['title', 'description', 'location', 'category', 'date'],
        sortOptions: ['date', 'title', 'price']
    }
};

export class ConfigService {
    private static instance: ConfigService;
    private config: ExtendedConfig | null = null;
    private isInitializing: boolean = false;
    private initPromise: Promise<ExtendedConfig> | null = null;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    private getApiUrl(): string {
        return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    }

    async fetchConfig(): Promise<ExtendedConfig> {
        // Return cached config if available
        if (this.config) {
            return this.config;
        }

        // If we're already initializing, return the existing promise
        if (this.initPromise) {
            return this.initPromise;
        }

        // Set up the initialization promise
        this.initPromise = (async () => {
            try {
                const apiUrl = this.getApiUrl();
                console.log('Fetching config from:', `${apiUrl}/config`);
                
                const response = await fetch(`${apiUrl}/config`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                if (!data) {
                    throw new Error('Empty configuration received');
                }
                
                // Merge with defaults to ensure all required fields are present
                this.config = { ...DEFAULT_CONFIG, ...data };
                return this.config;
            } catch (error) {
                console.error('Error fetching config, using defaults:', error);
                this.config = { ...DEFAULT_CONFIG };
                return this.config;
            } finally {
                this.isInitializing = false;
                this.initPromise = null;
            }
        })();

        return this.initPromise;
    }
    
    getConfig(): ExtendedConfig | null {
        return this.config;
    }

    clearConfig(): void {
        this.config = null;
    }
}
