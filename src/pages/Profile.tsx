
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EVENT_CATEGORIES } from '@/types';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileTabs from '@/components/Profile/ProfileTabs';
import { User } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AlertCircle, Calendar, Heart, Mail, MapPin, Star, Edit, Save } from 'lucide-react';

type UserRole = 'user' | 'event_creator' | 'admin' | 'viewer';

interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  preferences: string[];
  bio?: string;
  location?: string;
  avatar?: string;
  starredEvents?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const Profile = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setEditedUser({
          ...data,
          preferences: data.preferences || []
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSave = async () => {
    if (!editedUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedUser,
          // Only include fields that can be updated
          bio: editedUser.bio,
          location: editedUser.location,
          avatar: editedUser.avatar,
          preferences: editedUser.preferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setEditedUser(prev => ({
        ...prev,
        ...updatedUser,
        preferences: updatedUser.preferences || []
      }));
      setIsEditing(false);
      
      if (updateProfile) {
        updateProfile(updatedUser);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceToggle = (category: string) => {
    setEditedUser(prev => {
      if (!prev) return null;
      
      const currentPrefs = prev.preferences || [];
      const newPrefs = currentPrefs.includes(category)
        ? currentPrefs.filter(p => p !== category)
        : [...currentPrefs, category];
        
      return {
        ...prev,
        preferences: newPrefs
      };
    });
  };

  if (loading && !editedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Error loading profile</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!editedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No user data available</h2>
          <p className="text-gray-600 mt-2">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is rendered by the layout */}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                      {editedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{editedUser.name}</h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {editedUser.email}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {editedUser.location}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {editedUser.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? 'Save' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="starred">Starred Events</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
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
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editedUser.location}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Your location in Berlin"
                          className="mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700">{editedUser.bio}</p>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Member since {new Date(editedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Starred Events Tab */}
            <TabsContent value="starred">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Starred Events ({editedUser.starredEvents?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!editedUser.starredEvents || editedUser.starredEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">You haven't starred any events yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {editedUser.starredEvents.map((eventId) => (
                        <div key={eventId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">Event {eventId}</h3>
                              <p className="text-gray-600 text-sm mt-1">Loading event details...</p>
                              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Loading date...
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  Loading location...
                                </span>
                                <Badge variant="outline">
                                  Loading...
                                </Badge>
                                <span className="text-orange-600 font-medium mt-2">Loading...</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Event Preferences</CardTitle>
                  <p className="text-gray-600">Select the types of events you're interested in</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {EVENT_CATEGORIES.map((category) => (
                      <div
                        key={category}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          editedUser.preferences.includes(category)
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => isEditing && handlePreferenceToggle(category)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          {editedUser.preferences.includes(category) && (
                            <Star className="h-4 w-4 fill-current" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {!isEditing && (
                    <p className="text-sm text-gray-500 mt-4">
                      Click "Edit Profile" to modify your preferences
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
