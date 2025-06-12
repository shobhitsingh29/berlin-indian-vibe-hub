import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/types';

interface ProfileStarredEventsProps {
  user: any;
}

const ProfileStarredEvents = ({ user }: ProfileStarredEventsProps) => {
  const starredEvents = user.starredEvents || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Starred Events ({starredEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {starredEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">You haven't starred any events yet.</p>
        ) : (
          <div className="space-y-4">
            {starredEvents.map((event) => (
              <div key={event.eventId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.dateTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileStarredEvents;
