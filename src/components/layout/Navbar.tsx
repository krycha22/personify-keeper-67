
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { MoonIcon, SunIcon, Settings, Users, Home } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              People Contacts
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-between md:justify-end">
          <nav className="flex items-center space-x-1 md:flex md:space-x-2">
            <Button
              variant={isActive('/') ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/people') || location.pathname.includes('/people/') ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/people">
                <Users className="mr-2 h-4 w-4" />
                <span>People</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/settings') ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
          <div className="flex items-center space-x-2">
            <AuthButtons />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
