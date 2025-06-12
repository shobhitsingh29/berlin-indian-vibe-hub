
import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'viewer';
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  lastActive: string;
  eventsCreated: number;
  eventsAttended: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'organizer',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-10-20',
    eventsCreated: 12,
    eventsAttended: 25
  },
  {
    id: '2',
    name: 'Raj Patel',
    email: 'raj@example.com',
    role: 'viewer',
    status: 'active',
    joinedAt: '2024-02-20',
    lastActive: '2024-10-19',
    eventsCreated: 0,
    eventsAttended: 8
  },
  {
    id: '3',
    name: 'Ankita Singh',
    email: 'ankita@example.com',
    role: 'organizer',
    status: 'active',
    joinedAt: '2024-03-10',
    lastActive: '2024-10-20',
    eventsCreated: 7,
    eventsAttended: 15
  },
  {
    id: '4',
    name: 'Vikram Mehta',
    email: 'vikram@example.com',
    role: 'viewer',
    status: 'suspended',
    joinedAt: '2024-04-05',
    lastActive: '2024-10-15',
    eventsCreated: 0,
    eventsAttended: 3
  }
];

const mockAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ff5722&color=fff',
  role: 'admin'
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: 'admin' | 'organizer' | 'viewer') => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'organizer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={mockAdmin} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockAdmin} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage users, monitor platform activity, and maintain community standards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="eventbrite-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-gray-600 text-sm">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eventbrite-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                    <p className="text-gray-600 text-sm">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eventbrite-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {users.reduce((sum, u) => sum + u.eventsCreated, 0)}
                    </p>
                    <p className="text-gray-600 text-sm">Events Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eventbrite-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'organizer').length}
                    </p>
                    <p className="text-gray-600 text-sm">Organizers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="eventbrite-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl font-semibold">User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.eventsCreated} created</div>
                            <div className="text-gray-500">{user.eventsAttended} attended</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="space-y-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => handleRoleChange(user.id, 'organizer')}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Organizer
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => handleRoleChange(user.id, 'viewer')}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Make Viewer
                                </Button>
                                <div className="flex items-center justify-between p-2">
                                  <span className="text-sm">
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </span>
                                  <Switch
                                    checked={user.status === 'active'}
                                    onCheckedChange={() => handleStatusToggle(user.id)}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
