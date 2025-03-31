
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Person } from '@/context/PeopleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Pencil, User } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onDelete: (id: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onDelete }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Helper function to safely format strings with replacements
  const safeFormat = (key: string, replacements?: Record<string, string>) => {
    const translatedText = t(key);
    if (!translatedText) return key; // Fallback to key if translation is missing
    
    if (!replacements) return translatedText;
    
    return Object.entries(replacements).reduce((result, [placeholder, value]) => {
      return result.replace(new RegExp(`{${placeholder}}`, 'g'), value || '');
    }, translatedText);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleEdit = () => {
    navigate(`/people/${person.id}/edit`);
  };

  const handleView = () => {
    navigate(`/people/${person.id}`);
  };

  // Function to get a job title from custom fields if it exists
  const getJobTitle = () => {
    const jobTitleField = person.customFields['field-1']; // Job Title field
    return jobTitleField || t('person.noJobTitle');
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start cursor-pointer" onClick={handleView}>
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={person.photo} alt={`${person.firstName} ${person.lastName}`} />
            <AvatarFallback className="text-lg bg-primary/10">
              {getInitials(person.firstName, person.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-lg">{person.firstName} {person.lastName}</h3>
            {person.nickname && (
              <p className="text-sm text-muted-foreground">"{person.nickname}"</p>
            )}
            <p className="text-sm text-muted-foreground">{getJobTitle()}</p>
            <p className="text-sm">{person.email}</p>
            {person.phone && <p className="text-sm">{person.phone}</p>}
          </div>
        </div>

        <div className="border-t px-4 py-2 flex justify-between bg-muted/30">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            {t('person.edit')}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('person.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('person.areYouSure')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {safeFormat('person.deleteConfirmation', { name: `${person.firstName} ${person.lastName}` })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('person.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(person.id)}
                >
                  {t('person.confirmDelete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
