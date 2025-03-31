
import React from 'react';
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/hooks/use-toast";

interface VisibilityControlProps {
  personId: string;
  isHidden: boolean;
  onToggleVisibility: (id: string) => void;
}

const VisibilityControl: React.FC<VisibilityControlProps> = ({ 
  personId, 
  isHidden, 
  onToggleVisibility 
}) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin()) {
    return null;
  }

  const handleToggle = () => {
    onToggleVisibility(personId);
    
    toast({
      title: isHidden ? "Profil widoczny" : "Profil ukryty",
      description: isHidden 
        ? "Profil jest teraz widoczny dla wszystkich użytkowników" 
        : "Profil jest teraz ukryty przed zwykłymi użytkownikami",
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      title={isHidden ? "Pokaż profil" : "Ukryj profil"}
    >
      {isHidden ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VisibilityControl;
