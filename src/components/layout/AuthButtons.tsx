
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User } from "lucide-react";

const AuthButtons: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm hidden md:inline-block">
            {user.role === 'admin' ? 'Admin: ' : ''}
            {user.username}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </Button>
        </>
      ) : (
        <Button variant="outline" size="sm" onClick={handleLogin}>
          <LogIn className="mr-2 h-4 w-4" />
          Zaloguj
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
