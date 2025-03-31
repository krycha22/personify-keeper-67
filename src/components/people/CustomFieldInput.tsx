
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomField } from "@/context/PeopleContext";
import { cn } from "@/lib/utils";

interface CustomFieldInputProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

const CustomFieldInput: React.FC<CustomFieldInputProps> = ({
  field,
  value,
  onChange,
  className,
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.isRequired}
          />
        );
      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.isRequired}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            id={field.id}
            checked={value || false}
            onCheckedChange={onChange}
            required={field.isRequired}
          />
        );
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            required={field.isRequired}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              )) || []}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={field.id} className="flex items-center space-x-2">
        <span>{field.name}</span>
        {field.isRequired && <span className="text-destructive">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default CustomFieldInput;
