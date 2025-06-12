import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label, Textarea, Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface ProfileOverviewProps {
  user: any;
  isEditing: boolean;
}

const ProfileOverview = ({ user, isEditing }: ProfileOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={user.bio}
                onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={user.location}
                onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Your location in Berlin"
                className="mt-1"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700">{user.bio}</p>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
