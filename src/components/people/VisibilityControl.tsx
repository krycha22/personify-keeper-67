
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VisibilityControlProps {
  personId: string;
}

const VisibilityControl: React.FC<VisibilityControlProps> = ({ personId }) => {
  const { isAdmin, currentUser, isPersonHidden, hidePersonForUser, showPersonForUser } = useAuth();
  
  if (!isAdmin || !currentUser) return null;
  
  const isHidden = isPersonHidden(personId);
  
  const toggleVisibility = () => {
    if (isHidden) {
      showPersonForUser(personId, "user-1"); // Regular user ID
    } else {
      hidePersonForUser(personId, "user-1"); // Regular user ID
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleVisibility}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isHidden ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isHidden 
            ? "Make visible to standard user" 
            : "Hide from standard user"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VisibilityControl;
