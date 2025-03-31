
import React from 'react';
import Navbar from './Navbar';
import { useLanguage } from '@/context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        {children}
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          © {new Date().getFullYear()} {t('app.name')} - {t('app.tagline')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
