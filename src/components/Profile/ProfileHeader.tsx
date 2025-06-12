import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  user: any;
  isEditing: boolean;
  onEdit: () => void;
}

const ProfileHeader = ({ user, isEditing, onEdit }: ProfileHeaderProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-2" />
                {user.location}
              </p>
              <Badge variant="secondary" className="mt-2">
                {user.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button
            onClick={onEdit}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Save' : 'Edit Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
