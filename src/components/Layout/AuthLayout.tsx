import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

function InnerLayout() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">Indian Vibe Hub</h1>
            <div className="flex items-center space-x-4">
              {!user ? (
                <Button
                  onClick={signInWithGoogle}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <Button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}

export function AuthLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
