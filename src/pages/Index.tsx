
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Users } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-4">Welcome to People Contacts</h1>
        
        {isAuthenticated && currentUser && (
          <p className="text-xl mb-6">
            Hello, <span className="font-medium">{currentUser.username}</span>!
            {currentUser.isAdmin && (
              <span className="ml-2 text-blue-500 font-medium">(Admin)</span>
            )}
          </p>
        )}
        
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Manage your contacts, organize relationships, and keep track of important information about the people in your life.
        </p>
        
        <Button size="lg" onClick={() => navigate('/people')}>
          <Users className="mr-2 h-5 w-5" />
          View People
        </Button>
      </div>
    </Layout>
  );
};

export default Index;
