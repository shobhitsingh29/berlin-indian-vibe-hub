import { Event, EventCreateInput, EventUpdateInput } from '@/types/event';
import { ConfigService } from './config';

export class EventsService {
    private static instance: EventsService;
    private configService: ConfigService;

    private constructor() {
        this.configService = ConfigService.getInstance();
    }

    public static getInstance(): EventsService {
        if (!EventsService.instance) {
            EventsService.instance = new EventsService();
        }
        return EventsService.instance;
    }

    async fetchEvents(): Promise<Event[]> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            return data as Event[];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    async fetchEventsByCategory(category: string): Promise<Event[]> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/category/${category}`);
            if (!response.ok) {
                throw new Error('Failed to fetch events by category');
            }
            const data = await response.json();
            return data as Event[];
        } catch (error) {
            console.error('Error fetching events by category:', error);
            throw error;
        }
    }

    async fetchEventById(id: string): Promise<Event> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event');
            }
            const data = await response.json();
            return data as Event;
            return await response.json();
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    }

    async createEvent(eventData: EventCreateInput): Promise<Event> {
        try {
            const config = await this.configService.fetchConfig();
            if (!config) {
                throw new Error('Configuration not available');
            }

            // Validate against config
            if (eventData.title.length < config.minTitleLength || eventData.title.length > config.maxTitleLength) {
                throw new Error('Invalid title length');
            }
            if (eventData.description?.length < config.minDescriptionLength || eventData.description?.length > config.maxDescriptionLength) {
                throw new Error('Invalid description length');
            }
            if (!config.eventCategories.includes(eventData.category)) {
                throw new Error('Invalid category');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            const data = await response.json();
            return data as Event;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    async updateEvent(id: string, eventData: EventUpdateInput): Promise<Event> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventData)
            });
            if (!response.ok) {
                throw new Error('Failed to update event');
            }
            const data = await response.json();
            return data as Event;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    async starEvent(eventId: string): Promise<void> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/star`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to star/unstar event');
            }
        } catch (error) {
            console.error('Error starring/unstarring event:', error);
            throw error;
        }
    }

    async deleteEvent(id: string): Promise<void> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            // For DELETE, we don't expect any response body
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
}
