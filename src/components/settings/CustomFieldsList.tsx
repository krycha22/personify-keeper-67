
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CustomField } from '@/context/PeopleContext';
import { useLanguage } from '@/context/LanguageContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ListFilter, Trash2 } from 'lucide-react';

interface CustomFieldsListProps {
  fields: CustomField[];
  onDelete: (id: string) => void;
}

const CustomFieldsList: React.FC<CustomFieldsListProps> = ({ fields, onDelete }) => {
  const { t } = useLanguage();
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const getFieldTypeName = (type: 'text' | 'number' | 'date' | 'boolean') => {
    switch (type) {
      case 'text':
        return t('settings.fieldTypeText');
      case 'number':
        return t('settings.fieldTypeNumber');
      case 'date':
        return t('settings.fieldTypeDate');
      case 'boolean':
        return t('settings.fieldTypeBoolean');
      default:
        return type;
    }
  };

  const confirmDelete = (id: string) => {
    setFieldToDelete(id);
  };

  const handleDelete = () => {
    if (fieldToDelete) {
      onDelete(fieldToDelete);
      setFieldToDelete(null);
    }
  };

  const cancelDelete = () => {
    setFieldToDelete(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListFilter className="h-5 w-5" />
          {t('settings.customFields')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {t('settings.noCustomFields')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('settings.fieldName')}</TableHead>
                <TableHead>{t('settings.fieldType')}</TableHead>
                <TableHead>{t('settings.required')}</TableHead>
                <TableHead className="text-right">{t('settings.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{getFieldTypeName(field.type)}</TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {t('settings.yes')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                        {t('settings.no')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(field.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('settings.deleteField')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('settings.deleteFieldDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={cancelDelete}>
                            {t('settings.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            {t('settings.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomFieldsList;
