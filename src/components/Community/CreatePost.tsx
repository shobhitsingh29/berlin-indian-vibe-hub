
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image, X } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';

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
  const { config } = useConfig();

  if (!config) {
    return <div>Loading...</div>;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > config.maxImagesPerPost) {
      alert(`You can only upload up to ${config.maxImagesPerPost} images`);
      return;
    }

    const validFiles = files.filter(file => {
      const maxSize = config.maxImageSize * 1024 * 1024; // Convert to bytes
      
      if (!config.validImageTypes.includes(file.type)) {
        alert(`Please select valid image files (${config.validImageTypes.join(', ')})`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`Image size should be less than ${config.maxImageSize}MB`);
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
          <p className="text-gray-600">{config.loginMessage}</p>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            {config.loginButtonText}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="eventbrite-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500">{config.postPrompt}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={config.postPlaceholder}
            className="min-h-[100px]"
          />

          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 hover:bg-gray-100"
                  disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept={config.validImageTypes.join(',')}
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
              >
                <Image className="w-4 h-4 mr-2" />
                {config.addPhotoButtonText}
              </Button>
            </label>
            <Button
              type="submit"
              disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Posting...' : config.postButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
