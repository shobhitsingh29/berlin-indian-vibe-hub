
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, MapPin, ExternalLink, Heart, Users } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { useConfig } from '@/contexts/ConfigContext';

interface EventCardProps {
  event: Event;
  onStar?: (eventId: string) => void;
  compact?: boolean;
}

const EventCard = ({ event, onStar, compact = false }: EventCardProps) => {
  const [isStarred, setIsStarred] = useState(event.isStarred || false);
  const [isStarring, setIsStarring] = useState(false);
  const { config } = useConfig();

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarring(true);
    try {
      await onStar?.(event.eventId);
      setIsStarred(!isStarred);
    } catch (error) {
      console.error('Error starring event:', error);
    } finally {
      setIsStarring(false);
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const eventDate = new Date(event.dateTime);
  const formattedDate = format(eventDate, config.dateFormat.replace('YYYY', 'yyyy').replace('DD', 'dd'));
  const formattedTime = format(eventDate, config.timeFormat);

  if (compact) {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-saffron flex flex-col items-center justify-center text-white text-xs font-medium">
              <span>{format(eventDate, 'dd')}</span>
              <span>{format(eventDate, 'MMM')}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formattedTime}
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStar}
                  disabled={isStarring}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <Star
                    className={`h-4 w-4 transition-colors ${
                      isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  />
                </Button>
              </div>
              
              <Badge variant="secondary" className="mt-2 text-xs">
                {event.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white">
      <div className="relative">
        {event.bannerImageUrl ? (
          <img
            src={event.bannerImageUrl}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 gradient-cultural flex items-center justify-center">
            <Heart className="h-12 w-12 text-white opacity-80" />
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            {event.category}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            disabled={isStarring}
            className="h-9 w-9 p-0 bg-white/90 hover:bg-white"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600 hover:text-yellow-500'
              }`}
            />
          </Button>
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-sm font-semibold text-gray-900">{formattedDate}</div>
            <div className="text-xs text-gray-600">{formattedTime}</div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          
          {event.cost && (
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.cost}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {format(new Date(event.createdAt), 'MMM dd, yyyy')}
          </div>
          
          {event.rsvpLink && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
              <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                RSVP
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
