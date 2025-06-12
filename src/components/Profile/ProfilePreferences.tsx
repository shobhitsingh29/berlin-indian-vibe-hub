import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EVENT_CATEGORIES } from '@/types';

interface ProfilePreferencesProps {
  user: any;
  onPreferenceToggle: (category: string) => void;
}

const ProfilePreferences = ({ user, onPreferenceToggle }: ProfilePreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {EVENT_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={user.preferences.includes(category)}
                onChange={() => onPreferenceToggle(category)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label className="ml-2 text-sm text-gray-700">{category}</label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreferences;
