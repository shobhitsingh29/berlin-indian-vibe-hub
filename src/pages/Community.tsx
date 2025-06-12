import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import CreatePost from '@/components/Community/CreatePost';
import CommunityPost from '@/components/Community/CommunityPost';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, TrendingUp, Sparkles } from 'lucide-react';
import { CommunityPost as CommunityPostType } from '@/types';

// Mock data
const mockPosts = [
  {
    postId: '1',
    userId: 'user1',
    userName: 'Priya Sharma',
    content: 'Just attended the Bharatanatyam workshop and it was incredible! The instructor was amazing and so patient with beginners. Highly recommend for anyone interested in classical dance. The studio was beautiful and the other participants were so welcoming. Already signed up for next week! 🕺✨',
    createdAt: '2024-10-20T14:30:00Z',
    likes: 12,
    isLiked: false,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500']
  },
  {
    postId: '2',
    userId: 'user2',
    userName: 'Raj Patel',
    content: 'Looking for people to share a ride to the Diwali festival at Tempodrom this weekend. Anyone from Kreuzberg area interested? We can split the cost and have great company! Let me know if you want to join. 🚗🪔',
    createdAt: '2024-10-20T10:15:00Z',
    likes: 8,
    isLiked: true,
  },
  {
    postId: '3',
    userId: 'user3',
    userName: 'Ankita Singh',
    content: 'Amazing Indian street food festival today at Mauerpark! The chaat was absolutely delicious and reminded me of home. The organizers did such a great job. Already looking forward to the next one! If you missed it, definitely catch the next one. 🍛❤️',
    createdAt: '2024-10-19T18:45:00Z',
    likes: 15,
    isLiked: false,
  },
  {
    postId: '4',
    userId: 'user4',
    userName: 'Vikram Mehta',
    content: 'Does anyone know of good places to buy authentic Indian spices in Berlin? I\'m planning to cook a big meal for friends but need to find quality ingredients. Any recommendations would be greatly appreciated! 🌶️',
    createdAt: '2024-10-19T16:20:00Z',
    likes: 6,
    isLiked: false,
  },
  {
    postId: '5',
    userId: 'user5',
    userName: 'Meera Krishnan',
    content: 'The yoga session in Tiergarten this morning was so peaceful! Perfect way to start the weekend. The instructor spoke both English and Hindi which made it accessible for everyone. Nature + yoga + community = perfect Saturday morning! 🧘‍♀️🌳',
    createdAt: '2024-10-19T12:10:00Z',
    likes: 9,
    isLiked: true,
  }
];

const mockUser = {
  name: 'Anjali Sharma',
  email: 'anjali@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Anjali+Sharma&background=f97316&color=fff',
  role: 'viewer'
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = async (content: string, images?: File[]) => {
    // Simulate API call with image upload
    const imageUrls = images?.map((_, index) => 
      `https://images.unsplash.com/photo-${1500000000000 + index}?w=500`
    ) || [];
    
    const newPost = {
      postId: Date.now().toString(),
      userId: mockUser.email,
      userName: mockUser.name,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      images: imageUrls,
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = async (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.postId === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={mockUser} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Community Hub
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with fellow culture enthusiasts, share experiences, ask questions, and build meaningful relationships
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="eventbrite-shadow eventbrite-hover">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">127+</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </CardContent>
            </Card>
            
            <Card className="eventbrite-shadow eventbrite-hover">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="text-sm text-gray-600">Posts This Month</div>
              </CardContent>
            </Card>
            
            <Card className="eventbrite-shadow eventbrite-hover">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">456</div>
                <div className="text-sm text-gray-600">Total Interactions</div>
              </CardContent>
            </Card>
          </div>

          {/* Create Post */}
          <div className="mb-8">
            <CreatePost user={mockUser} onSubmit={handleCreatePost} />
          </div>

          {/* Community Guidelines */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 eventbrite-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Guidelines</h3>
                  <p className="text-gray-700 text-sm">
                    Keep discussions respectful and welcoming. Share your experiences, ask questions, 
                    and help others discover the beauty of Indian culture in Berlin. No spam or promotional content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Be the first to start a conversation!</p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <div key={post.postId} className="animate-fade-in">
                    <CommunityPost post={post} onLike={handleLikePost} />
                  </div>
                ))}
                
                {/* Load More */}
                <div className="text-center pt-8">
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                    Load More Posts
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
