
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Person } from "@/context/PeopleContext";
import { User, Edit, Trash2, Images } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onDelete }) => {
  const { t } = useLanguage();
  const defaultPhotoUrl = 'https://www.gravatar.com/avatar/?d=mp';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Use the first photo from gallery
  const displayPhotoDetail = person.photoDetails && person.photoDetails.length > 0 
    ? person.photoDetails[0] 
    : null;
    
  const displayPhoto = displayPhotoDetail?.url || person.photo || 
    (person.photos && person.photos.length > 0 ? person.photos[0] : undefined);
    
  const hasMultiplePhotos = person.photoDetails 
    ? person.photoDetails.length > 1 
    : (person.photos ? person.photos.length > 1 : false);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <Link to={`/people/${person.id}`} className="hover:underline">
            {person.firstName} {person.lastName}
          </Link>
        </CardTitle>
        {person.nickname && (
          <p className="text-sm text-muted-foreground">"{person.nickname}"</p>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 border">
            <img 
              src={displayPhoto || defaultPhotoUrl} 
              alt={`${person.firstName} ${person.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultPhotoUrl;
              }}
            />
            {hasMultiplePhotos && (
              <Badge className="absolute bottom-0 right-0 text-xs" variant="secondary">
                <Images className="h-3 w-3 mr-1" />
                {person.photoDetails?.length || person.photos?.length}
              </Badge>
            )}
          </div>
          {displayPhotoDetail?.description && (
            <p className="text-xs text-center text-muted-foreground max-w-full truncate">
              {displayPhotoDetail.description}
            </p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          {person.email && (
            <p className="truncate">
              <span className="font-semibold">{t('fields.email')}:</span> {person.email}
            </p>
          )}
          {person.phone && (
            <p className="truncate">
              <span className="font-semibold">{t('fields.phone')}:</span> {person.phone}
            </p>
          )}
          {person.birthDate && (
            <p>
              <span className="font-semibold">{t('fields.birthDate')}:</span> {formatDate(person.birthDate)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/people/${person.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('person.edit')}
          </Link>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              {t('person.delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('person.areYouSure')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('person.deleteConfirmation', { name: `${person.firstName} ${person.lastName}` })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('person.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(person.id)}>
                {t('person.confirmDelete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default PersonCard;
