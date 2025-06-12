
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image, X } from 'lucide-react';

interface CreatePostProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onSubmit?: (content: string, images?: File[]) => Promise<void>;
}

const CreatePost = ({ user, onSubmit }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 4;
    
    if (selectedImages.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please select valid image files (JPEG, PNG, GIF, WebP)');
        return false;
      }
      
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!content.trim() && selectedImages.length === 0) || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit?.(content.trim(), selectedImages);
      setContent('');
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="eventbrite-shadow">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please login to join the community discussion</p>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="eventbrite-shadow">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff5722&color=fff`} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder="Ask a question, share a tip, or connect with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-gray-200 focus:ring-primary focus:border-primary"
                maxLength={500}
              />
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedImages.length >= 4}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Photo
                  </Button>
                  <div className="text-sm text-gray-500">
                    {content.length}/500 characters
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    'Posting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
