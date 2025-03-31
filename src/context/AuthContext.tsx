
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  isAdmin: boolean;
}

// Demo users
const DEMO_USERS: User[] = [
  {
    id: "user-1",
    username: "user",
    password: "password123", // Regular user password
    isAdmin: false
  },
  {
    id: "admin-1",
    username: "admin",
    password: "admin456", // Admin password
    isAdmin: true
  }
];

interface HiddenPerson {
  personId: string;
  hiddenBy: string; // userId who hid this person
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hiddenPeople: HiddenPerson[];
  hidePersonForUser: (personId: string, userId: string) => void;
  showPersonForUser: (personId: string, userId: string) => void;
  isPersonHidden: (personId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hiddenPeople, setHiddenPeople] = useState<HiddenPerson[]>([]);
  const { toast } = useToast();

  // Load auth state from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedHiddenPeople = localStorage.getItem('hiddenPeople');

      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }

      if (savedHiddenPeople) {
        setHiddenPeople(JSON.parse(savedHiddenPeople));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
  }, []);

  // Save hidden people to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('hiddenPeople', JSON.stringify(hiddenPeople));
    } catch (error) {
      console.error('Error saving hidden people:', error);
    }
  }, [hiddenPeople]);

  const login = (username: string, password: string): boolean => {
    const user = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    }

    toast({
      title: "Login failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const hidePersonForUser = (personId: string, userId: string) => {
    if (!currentUser?.isAdmin) return;

    const alreadyHidden = hiddenPeople.some(
      (item) => item.personId === personId && item.hiddenBy === userId
    );

    if (!alreadyHidden) {
      setHiddenPeople([...hiddenPeople, { personId, hiddenBy: userId }]);
      
      toast({
        title: "Person hidden",
        description: "This person is now hidden for the specified user",
      });
    }
  };

  const showPersonForUser = (personId: string, userId: string) => {
    if (!currentUser?.isAdmin) return;

    setHiddenPeople(
      hiddenPeople.filter(
        (item) => !(item.personId === personId && item.hiddenBy === userId)
      )
    );
    
    toast({
      title: "Person visible",
      description: "This person is now visible for the specified user",
    });
  };

  const isPersonHidden = (personId: string): boolean => {
    if (!currentUser) return false;
    
    return hiddenPeople.some(
      (item) => item.personId === personId && item.hiddenBy === currentUser.id
    );
  };

  const isAdmin = currentUser?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        hiddenPeople,
        hidePersonForUser,
        showPersonForUser,
        isPersonHidden,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
