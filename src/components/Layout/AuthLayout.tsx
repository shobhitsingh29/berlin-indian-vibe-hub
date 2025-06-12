import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export function AuthLayout() {
  return (
    <AuthProvider>
      <AuthLayoutContent />
    </AuthProvider>
  );
}

function AuthLayoutContent() {
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
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in with Google
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL || ''}
                    alt={user.displayName || ''}
                    className="h-8 w-8 rounded-full"
                  />
                  <Button
                    onClick={signOut}
                    variant="outline"
                    className="text-orange-600"
                  >
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}