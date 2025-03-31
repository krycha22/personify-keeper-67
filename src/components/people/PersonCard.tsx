
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Person } from '@/context/PeopleContext';
import VisibilityControl from './VisibilityControl';
import { useAuth } from '@/context/AuthContext';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ 
  person, 
  onDelete,
  onToggleVisibility 
}) => {
  const { isAdmin } = useAuth();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Czy na pewno chcesz usunąć tę osobę?')) {
      onDelete(person.id);
    }
  };

  // Jeśli osoba jest ukryta i użytkownik nie jest adminem, nie renderuj karty
  if (person.isHidden && !isAdmin()) {
    return null;
  }

  const getInitials = () => {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className={`overflow-hidden transition-colors ${person.isHidden ? 'bg-muted/50' : ''}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.photo} alt={`${person.firstName} ${person.lastName}`} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {person.firstName} {person.lastName}
              </h3>
              {person.nickname && (
                <p className="text-sm text-muted-foreground">"{person.nickname}"</p>
              )}
            </div>
          </div>
          
          {isAdmin() && onToggleVisibility && (
            <VisibilityControl 
              personId={person.id}
              isHidden={!!person.isHidden}
              onToggleVisibility={onToggleVisibility}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {person.email && <p className="text-sm mb-1">{person.email}</p>}
        {person.phone && <p className="text-sm mb-1">{person.phone}</p>}
        
        {person.tags && person.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {person.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {person.isHidden && isAdmin() && (
          <Badge variant="outline" className="mt-2 bg-muted">
            Ukryty
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/people/${person.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Szczegóły
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/people/${person.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edycja
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PersonCard;
