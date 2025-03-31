
import React from 'react';
import { CustomField } from '@/context/PeopleContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/context/LanguageContext';

interface CustomFieldInputProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
}

const CustomFieldInput: React.FC<CustomFieldInputProps> = ({ field, value, onChange }) => {
  const { t } = useLanguage();
  
  // Handle null/undefined values
  const safeValue = value !== undefined && value !== null ? value : (field.type === 'boolean' ? false : '');
  
  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={`field-${field.id}`}
            type="text"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
      case 'number':
        return (
          <Input
            id={`field-${field.id}`}
            type="number"
            value={safeValue}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            required={field.required}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={`field-${field.id}`}
              checked={!!safeValue}
              onCheckedChange={onChange}
            />
            <Label htmlFor={`field-${field.id}`} className="cursor-pointer">
              {safeValue ? t('common.yes') : t('common.no')}
            </Label>
          </div>
        );
      case 'date':
        return (
          <Input
            id={`field-${field.id}`}
            type="date"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${field.id}`}>
        {field.name}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
};

export default CustomFieldInput;
