
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import EventCard from '@/components/Events/EventCard';
import EventFilters from '@/components/Events/EventFilters';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Event, EventFilters as EventFiltersType } from '@/types';

// Mock data - in real app this would come from API
const mockEvents: Event[] = [
  {
    eventId: '1',
    title: 'Diwali Festival 2024',
    description: 'Join us for the biggest Diwali celebration in Berlin! Traditional music, dance performances, authentic food, and fireworks to light up the night.',
    category: 'Festival',
    dateTime: '2024-11-01T18:00:00Z',
    location: 'Tempodrom, Berlin',
    cost: 'Free Entry',
    rsvpLink: 'https://example.com/rsvp',
    bannerImageUrl: 'https://images.unsplash.com/photo-1541695267624-f5d60bf7e00f?w=800&h=600&fit=crop',
    createdBy: 'user1',
    createdAt: '2024-10-15T10:00:00Z',
  },
  {
    eventId: '2',
    title: 'Kathak Dance Workshop',
    description: 'Learn the graceful art of Kathak dance from renowned instructor Priya Sharma. All skill levels welcome.',
    category: 'Workshop',
    dateTime: '2024-10-28T14:00:00Z',
    location: 'Dance Studio Mitte',
    cost: '€25',
    rsvpLink: 'https://example.com/rsvp',
    createdBy: 'user2',
    createdAt: '2024-10-12T15:30:00Z',
  },
  {
    eventId: '3',
    title: 'Indian Street Food Festival',
    description: 'Taste authentic street food from across India. From Mumbai\'s vada pav to Delhi\'s chaat, experience the flavors of India in the heart of Berlin.',
    category: 'Food & Dining',
    dateTime: '2024-11-05T12:00:00Z',
    location: 'Mauerpark, Berlin',
    cost: 'Food pricing varies',
    bannerImageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    createdBy: 'user3',
    createdAt: '2024-10-10T09:00:00Z',
  },
  {
    eventId: '4',
    title: 'Bollywood Movie Night',
    description: 'Join us for a screening of classic Bollywood hits under the stars. Bring your friends and family for a night of entertainment.',
    category: 'Art & Culture',
    dateTime: '2024-10-30T19:30:00Z',
    location: 'Open Air Cinema Kreuzberg',
    cost: '€8',
    createdBy: 'user4',
    createdAt: '2024-10-08T11:00:00Z',
  },
  {
    eventId: '5',
    title: 'Yoga & Meditation Session',
    description: 'Start your weekend with inner peace. Traditional Hatha Yoga and guided meditation in English and Hindi.',
    category: 'Spiritual',
    dateTime: '2024-10-26T09:00:00Z',
    location: 'Tiergarten Park',
    cost: '€12',
    bannerImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    createdBy: 'user5',
    createdAt: '2024-10-05T14:20:00Z',
  },
  {
    eventId: '6',
    title: 'Classical Music Concert',
    description: 'An evening of Indian classical music featuring renowned sitar player Pandit Ravi Kumar and tabla maestro Ustad Ahmed Ali.',
    category: 'Music & Dance',
    dateTime: '2024-11-08T20:00:00Z',
    location: 'Konzerthaus Berlin',
    cost: '€35-€75',
    createdBy: 'user6',
    createdAt: '2024-10-03T16:45:00Z',
  }
];

const mockUser = {
  name: 'Anjali Sharma',
  email: 'anjali@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Anjali+Sharma&background=f97316&color=fff',
  role: 'event_creator'
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = events;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.dateTime);
        const start = filters.dateRange!.start ? new Date(filters.dateRange!.start) : null;
        const end = filters.dateRange!.end ? new Date(filters.dateRange!.end) : null;
        
        return (!start || eventDate >= start) && (!end || eventDate <= end);
      });
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleStarEvent = async (eventId: string) => {
    // Simulate API call
    console.log('Toggling star for event:', eventId);
    
    setEvents(prev => prev.map(event => 
      event.eventId === eventId 
        ? { ...event, isStarred: !event.isStarred }
        : event
    ));
  };

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={mockUser} onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Discover Events
            </h1>
            <p className="text-gray-600">
              Find amazing Indian cultural events happening in Berlin
            </p>
          </div>
          
          {(mockUser.role === 'event_creator' || mockUser.role === 'admin') && (
            <Button 
              onClick={() => navigate('/create-event')}
              className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFilters
            filters={filters}
            onFiltersChange={setFilters}
            resultsCount={filteredEvents.length}
          />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(filters).length > 0 
                ? "Try adjusting your filters to find more events"
                : "Be the first to create an event for the community!"
              }
            </p>
            {(mockUser.role === 'event_creator' || mockUser.role === 'admin') && (
              <Button 
                onClick={() => navigate('/create-event')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.eventId} className="animate-fade-in">
                <EventCard 
                  event={event} 
                  onStar={handleStarEvent}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredEvents.length > 0 && filteredEvents.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;