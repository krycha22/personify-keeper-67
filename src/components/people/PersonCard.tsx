
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2, View } from "lucide-react";
import { Person } from '@/context/PeopleContext';
import VisibilityControl from './VisibilityControl';
import { useAuth } from '@/context/AuthContext';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onDelete }) => {
  const { firstName, lastName, nickname, email, phone, photo } = person;
  const { isAdmin, isPersonHidden } = useAuth();
  const isHidden = isPersonHidden(person.id);
  
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  return (
    <Card className={`${isHidden && isAdmin ? 'opacity-50' : ''} overflow-hidden`}>
      <CardHeader className="p-0">
        <div className="relative h-32 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
          {isAdmin && (
            <div className="absolute top-2 right-2 z-10">
              <VisibilityControl personId={person.id} />
            </div>
          )}
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={photo} alt={fullName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-center">
        <h3 className="font-medium text-lg">{fullName}</h3>
        {nickname && <p className="text-sm text-muted-foreground">"{nickname}"</p>}
        <div className="mt-2 space-y-1">
          <p className="text-sm">{email}</p>
          {phone && <p className="text-sm">{phone}</p>}
        </div>
        {isHidden && isAdmin && (
          <div className="mt-2 text-xs text-muted-foreground bg-muted p-1 rounded">
            Hidden from standard user
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" asChild size="sm">
          <Link to={`/people/${person.id}`}>
            <View className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/people/${person.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(person.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default PersonCard;
