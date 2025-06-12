
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import { CommunityPost as CommunityPostType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommunityPostProps {
  post: CommunityPostType;
  onLike?: (postId: string) => void;
}

const CommunityPost = ({ post, onLike }: CommunityPostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    
    try {
      await onLike?.(post.postId);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&background=f97316&color=fff`} />
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {post.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{post.userName}</h4>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
            
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`h-8 px-3 ${
                  isLiked 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-1 transition-colors ${
                    isLiked ? 'fill-red-600' : ''
                  }`}
                />
                <span className="text-sm">{likesCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPost;
