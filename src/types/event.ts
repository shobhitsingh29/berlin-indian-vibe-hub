export interface Event {
    _id: string;
    eventId: string;
    title: string;
    description: string;
    location: string;
    dateTime: string;
    category: string;
    imageUrl: string;
    bannerImageUrl?: string;
    organizer: {
        _id: string;
        name: string;
    };
    ticketsAvailable: number;
    price: number;
    cost: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    isStarred?: boolean;
    rsvpLink?: string;
}

export interface EventCreateInput {
    title: string;
    description: string;
    location: string;
    dateTime: string;
    category: string;
    imageUrl: string;
    bannerImageUrl?: string;
    ticketsAvailable: number;
    price: number;
    cost: number;
    rsvpLink?: string;
}

export interface EventUpdateInput {
    title?: string;
    description?: string;
    location?: string;
    dateTime?: string;
    category?: string;
    imageUrl?: string;
    bannerImageUrl?: string;
    ticketsAvailable?: number;
    price?: number;
    cost?: number;
    rsvpLink?: string;
    isStarred?: boolean;
}

export interface EventFilters {
    search?: string;
    category?: string;
    location?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}
