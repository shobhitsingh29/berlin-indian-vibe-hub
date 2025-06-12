import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import CreatePost from '@/components/Community/CreatePost';
import CommunityPost from '@/components/Community/CommunityPost';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { CommunityPost as CommunityPostType } from '@/types';
import { getPosts, createPost, likePost, deletePost } from '@/services/api/posts';

interface ApiPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  content: string;
  images: string[];
  likes: number;
  likedBy: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPosts = async (page = 1, append = false) => {
    try {
      setError(null);
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await getPosts(page);
      const newPosts = response.posts.map((post: ApiPost) => ({
        postId: post._id,
        userId: post.userId._id,
        userName: post.userId.name,
        content: post.content,
        images: post.images || [],
        likes: post.likes,
        isLiked: post.likedBy?.includes(user?._id || ''),
        createdAt: post.createdAt,
        comments: post.comments?.length || 0
      }));

      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(response.currentPage < response.totalPages);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleCreatePost = async (content: string, images: File[] = []) => {
    try {
      // In a real app, you would upload images first and get their URLs
      // For now, we'll just use the content
      const newPost = await createPost(content, []); // Pass empty array for images for now
      
      // Add the new post to the beginning of the list
      setPosts(prev => [{
        postId: newPost._id,
        userId: newPost.userId._id,
        userName: newPost.userId.name,
        content: newPost.content,
        images: newPost.images || [],
        likes: 0,
        isLiked: false,
        createdAt: newPost.createdAt,
        comments: 0
      }, ...prev]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.postId === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
            isLiked
          };
        }
        return post;
      }));

      // Call API
      await likePost(postId);
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      }));
      setError('Failed to update like. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      // Optimistic update
      setPosts(prev => prev.filter(post => post.postId !== postId));
      
      // Call API
      await deletePost(postId);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
      // Re-fetch posts to restore the correct state
      fetchPosts(1);
    }
  };

  const loadMorePosts = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage, true);
    }
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
