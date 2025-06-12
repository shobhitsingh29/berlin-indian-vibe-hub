
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPin, DollarSign, Link, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Layout/Header';
import { EVENT_CATEGORIES, BERLIN_ZONES } from '@/types';
import { cn } from '@/lib/utils';

// Mock user data
const mockUser = {
  userId: '1',
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  googleId: 'google123',
  role: 'event_creator' as const,
  preferences: ['Music & Dance', 'Food & Dining'],
  starredEvents: ['1', '2'],
  createdAt: '2024-01-15'
};

interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: Date | undefined;
  time: string;
  location: string;
  zone: string;
  cost: string;
  isFree: boolean;
  rsvpLink: string;
  bannerImage: File | null;
  tags: string[];
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    date: undefined,
    time: '',
    location: '',
    zone: '',
    cost: '',
    isFree: true,
    rsvpLink: '',
    bannerImage: null,
    tags: []
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      console.log('Creating event with data:', formData);
      
      // In real app, this would be an API call to create the event
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to events page or event detail page
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description && formData.category && 
                     formData.date && formData.time && formData.location && formData.zone;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600">Share your Indian cultural event with the Berlin community</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Diwali Celebration 2024"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your event, what to expect, dress code, etc."
                      className="mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add tags (e.g., family-friendly, outdoor)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Event Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !formData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => handleInputChange('date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="time">Start Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Venue Name & Address *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Cultural Center Berlin, Hauptstraße 123, 10123 Berlin"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="zone">Berlin Zone *</Label>
                    <Select value={formData.zone} onValueChange={(value) => handleInputChange('zone', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Berlin zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {BERLIN_ZONES.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Cost & RSVP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing & RSVP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFree"
                      checked={formData.isFree}
                      onCheckedChange={(checked) => handleInputChange('isFree', checked)}
                    />
                    <Label htmlFor="isFree">This is a free event</Label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <Label htmlFor="cost">Price Details</Label>
                      <Input
                        id="cost"
                        value={formData.cost}
                        onChange={(e) => handleInputChange('cost', e.target.value)}
                        placeholder="e.g., €15 - €25, Donation based, €10 (Students: €5)"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="rsvpLink">RSVP/Registration Link</Label>
                    <Input
                      id="rsvpLink"
                      type="url"
                      value={formData.rsvpLink}
                      onChange={(e) => handleInputChange('rsvpLink', e.target.value)}
                      placeholder="https://eventbrite.com/your-event"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Banner Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Event Banner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="banner">Upload Banner Image</Label>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended size: 1200x630px. Max file size: 5MB.
                    </p>
                    {formData.bannerImage && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.bannerImage.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
