
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import EventCard from '@/components/Events/EventCard';
import { Calendar, MapPin, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Event } from '@/types';

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    eventId: '1',
    title: 'Diwali Festival 2024',
    description: 'Join us for the biggest Diwali celebration in Berlin! Traditional music, dance performances, authentic food, and fireworks.',
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
    description: 'Taste authentic street food from across India. From Mumbai\'s vada pav to Delhi\'s chaat, experience the flavors of India.',
    category: 'Food & Dining',
    dateTime: '2024-11-05T12:00:00Z',
    location: 'Mauerpark, Berlin',
    cost: 'Food pricing varies',
    createdBy: 'user3',
    createdAt: '2024-10-10T09:00:00Z',
  },
];

const mockUser = {
  name: 'Anjali Sharma',
  email: 'anjali@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Anjali+Sharma&background=f97316&color=fff',
  role: 'viewer'
};

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeUsers: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Simulate API call
    setFeaturedEvents(mockEvents.slice(0, 3));
    setStats({
      totalEvents: 45,
      activeUsers: 127,
      upcomingEvents: 12
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header user={mockUser} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10" />
        <div className="relative container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-6">
              Rangmanch Berlin
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover vibrant Indian cultural events in Berlin. Connect with your community, 
              celebrate traditions, and create lasting memories.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/events">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse Events
                </Button>
              </Link>
              <Link to="/community">
                <Button size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 text-lg px-8 py-4">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.totalEvents}+</div>
                <div className="text-gray-600">Events Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.activeUsers}+</div>
                <div className="text-gray-600">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.upcomingEvents}</div>
                <div className="text-gray-600">This Month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Events
              </h2>
              <p className="text-gray-600">Don't miss these amazing upcoming events</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div key={event.eventId} className="animate-fade-in">
                <EventCard 
                  event={event} 
                  onStar={(eventId) => {
                    console.log('Starring event:', eventId);
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From traditional festivals to modern workshops, find events that match your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Festivals', icon: '🪔', count: 8 },
              { name: 'Music & Dance', icon: '🎵', count: 12 },
              { name: 'Food & Dining', icon: '🍛', count: 15 },
              { name: 'Workshops', icon: '🎨', count: 9 },
              { name: 'Spiritual', icon: '🕉️', count: 6 },
            ].map((category) => (
              <Card key={category.name} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.count} events</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Join Our Community
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect with fellow culture enthusiasts, share experiences, and get insider tips
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Just attended the Bharatanatyam workshop and it was incredible! The instructor was amazing. 
                    Highly recommend for anyone interested in classical dance. 🕺"
                  </p>
                  <div className="flex items-center mt-4 text-gray-500">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">12 likes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Raj Patel</h4>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Looking for people to share a ride to the Diwali festival at Tempodrom this weekend. 
                    Anyone from Kreuzberg area interested? 🚗"
                  </p>
                  <div className="flex items-center mt-4 text-gray-500">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">8 likes</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Link to="/community">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Users className="mr-2 h-4 w-4" />
                  Join the Discussion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Never Miss an Event Again
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Star your favorite events and get reminded so you never miss out on the cultural experiences you love
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-4">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg gradient-cultural flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-display text-xl font-semibold">Rangmanch Berlin</span>
              </div>
              <p className="text-gray-400">
                Connecting the Indian community in Berlin through culture and events.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/create-event" className="hover:text-white transition-colors">Create Event</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp Group</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rangmanch Berlin. Made with ❤️ for the Indian community in Berlin.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
