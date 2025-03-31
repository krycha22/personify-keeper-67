
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomField } from "@/context/PeopleContext";
import { useLanguage } from '@/context/LanguageContext';
import { PlusCircle, X } from "lucide-react";

interface CustomFieldFormProps {
  onAddField: (field: Omit<CustomField, 'id'>) => void;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({ onAddField }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [type, setType] = useState<'text' | 'date' | 'checkbox' | 'select'>('text');
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  const resetForm = () => {
    setName('');
    setType('text');
    setIsRequired(false);
    setOptions([]);
    setNewOption('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddField({
      name: name.trim(),
      type,
      isRequired,
      ...(type === 'select' && { options }),
    });
    
    resetForm();
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (option: string) => {
    setOptions(options.filter(o => o !== option));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customFields.add')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-name">{t('customFields.name')}</Label>
            <Input
              id="field-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Job Title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">{t('customFields.type')}</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="field-type">
                <SelectValue placeholder={t('customFields.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-required"
              checked={isRequired}
              onCheckedChange={(checked) => setIsRequired(checked === true)}
            />
            <Label htmlFor="field-required">{t('customFields.required')}</Label>
          </div>

          {type === 'select' && (
            <div className="space-y-4">
              <Label>{t('customFields.options')}</Label>
              <div className="flex space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder={t('customFields.addOption')}
                />
                <Button type="button" onClick={addOption} variant="outline">
                  {t('customFields.addButton')}
                </Button>
              </div>
              
              {options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-accent rounded-full px-3 py-1"
                    >
                      <span className="mr-2">{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => removeOption(option)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {options.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('customFields.optionsMessage')}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={type === 'select' && options.length === 0}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('customFields.addFieldButton')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CustomFieldForm;
