
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, User, Users, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground';
  };

  return (
    <nav className="border-b py-2 px-4 transition-colors bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold">
            PersonifyKeeper
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" className={isActive('/')}>
              <Users className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/people">
            <Button variant="ghost" className={isActive('/people')}>
              <Users className="mr-2 h-4 w-4" />
              People
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className={isActive('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
