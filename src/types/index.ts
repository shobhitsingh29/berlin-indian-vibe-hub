
export interface User {
  userId: string;
  name: string;
  email: string;
  googleId: string;
  role: 'viewer' | 'event_creator' | 'admin';
  preferences: string[];
  starredEvents: string[];
  createdAt: string;
}

export interface Event {
  eventId: string;
  title: string;
  description: string;
  category: string;
  dateTime: string;
  location: string;
  locationCoords?: {
    lat: number;
    lng: number;
  };
  cost: string;
  rsvpLink?: string;
  bannerImageUrl?: string;
  createdBy: string;
  createdAt: string;
  isStarred?: boolean;
}

export interface CommunityPost {
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface EventFilters {
  search?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
}

export const EVENT_CATEGORIES = [
  'Festival',
  'Music & Dance',
  'Food & Dining',
  'Workshop',
  'Spiritual',
  'Art & Culture',
  'Sports',
  'Networking',
  'Educational',
  'Community'
] as const;

export const BERLIN_ZONES = [
  'Mitte',
  'Kreuzberg',
  'Prenzlauer Berg',
  'Charlottenburg',
  'Neukölln',
  'Friedrichshain',
  'Wedding',
  'Schöneberg',
  'Tempelhof',
  'Online'
] as const;
