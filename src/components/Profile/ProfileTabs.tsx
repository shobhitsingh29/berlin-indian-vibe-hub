import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart } from 'lucide-react';
import ProfileOverview from './ProfileOverview';
import ProfileStarredEvents from './ProfileStarredEvents';
import ProfilePreferences from './ProfilePreferences';

interface ProfileTabsProps {
  user: any;
  isEditing: boolean;
  onPreferenceToggle: (category: string) => void;
}

const ProfileTabs = ({ user, isEditing, onPreferenceToggle }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="starred">Starred Events</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProfileOverview user={user} isEditing={isEditing} />
      </TabsContent>

      <TabsContent value="starred">
        <ProfileStarredEvents user={user} />
      </TabsContent>

      <TabsContent value="preferences">
        <ProfilePreferences user={user} onPreferenceToggle={onPreferenceToggle} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
