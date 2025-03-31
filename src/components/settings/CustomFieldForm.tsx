
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CustomField } from '@/context/PeopleContext';
import { useLanguage } from '@/context/LanguageContext';
import { PlusCircle } from 'lucide-react';

interface CustomFieldFormProps {
  onAddField: (field: Omit<CustomField, 'id'>) => void;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({ onAddField }) => {
  const { t } = useLanguage();
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'date' | 'boolean'>('text');
  const [required, setRequired] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fieldName.trim()) return;
    
    onAddField({
      name: fieldName.trim(),
      type: fieldType,
      required
    });
    
    // Reset form
    setFieldName('');
    setFieldType('text');
    setRequired(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          {t('settings.addCustomField')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-name">{t('settings.fieldName')}</Label>
            <Input
              id="field-name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder={t('settings.enterFieldName')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field-type">{t('settings.fieldType')}</Label>
            <Select 
              value={fieldType} 
              onValueChange={(value: 'text' | 'number' | 'date' | 'boolean') => setFieldType(value)}
            >
              <SelectTrigger id="field-type">
                <SelectValue placeholder={t('settings.selectFieldType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">{t('settings.fieldTypeText')}</SelectItem>
                <SelectItem value="number">{t('settings.fieldTypeNumber')}</SelectItem>
                <SelectItem value="date">{t('settings.fieldTypeDate')}</SelectItem>
                <SelectItem value="boolean">{t('settings.fieldTypeBoolean')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="required-field" 
              checked={required} 
              onCheckedChange={setRequired} 
            />
            <Label htmlFor="required-field">{t('settings.requiredField')}</Label>
          </div>
          
          <Button type="submit" className="w-full">
            {t('settings.addField')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomFieldForm;
