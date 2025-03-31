
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomField } from "@/context/PeopleContext";
import { useLanguage } from '@/context/LanguageContext';
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface CustomFieldsListProps {
  fields: CustomField[];
  onDelete: (id: string) => void;
}

const CustomFieldsList: React.FC<CustomFieldsListProps> = ({ fields, onDelete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  if (fields.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {t('customFields.noFields')}
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text Input';
      case 'date':
        return 'Date Picker';
      case 'checkbox':
        return 'Checkbox';
      case 'select':
        return 'Dropdown';
      default:
        return type;
    }
  };

  // Helper function to safely format strings with replacements
  const safeFormat = (key: string, replacements?: Record<string, string>) => {
    const translatedText = t(key);
    if (!translatedText) return key; // Fallback to key if translation is missing
    
    if (!replacements) return translatedText;
    
    return Object.entries(replacements).reduce((result, [placeholder, value]) => {
      return result.replace(new RegExp(`{${placeholder}}`, 'g'), value || '');
    }, translatedText);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customFields.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('customFields.name')}</TableHead>
              <TableHead>{t('customFields.type')}</TableHead>
              <TableHead>{t('fields.required')}</TableHead>
              <TableHead className="text-right">{t('customFields.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getTypeLabel(field.type)}</Badge>
                </TableCell>
                <TableCell>
                  {field.isRequired ? (
                    <Badge variant="default">{t('fields.required')}</Badge>
                  ) : (
                    <Badge variant="outline">{t('fields.optional')}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('customFields.deleteConfirmation')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {safeFormat('customFields.deleteConfirmationDescription', { field: field.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(field.id)}>
                          {t('settings.clearAll')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomFieldsList;
