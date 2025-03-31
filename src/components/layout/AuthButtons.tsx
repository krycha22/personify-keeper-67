
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AuthButtons = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center mr-2 text-sm">
        <span className="flex items-center gap-1">
          {currentUser?.isAdmin ? (
            <Shield className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4" />
          )}
          {currentUser?.username}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default AuthButtons;
