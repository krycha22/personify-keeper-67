
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface FieldRequirements {
  email: boolean;
  phone: boolean;
  address: boolean;
  birthDate: boolean;
  lastName: boolean;
  nickname: boolean;
}

interface FieldRequirementsContextType {
  fieldRequirements: FieldRequirements;
  updateFieldRequirement: (field: keyof FieldRequirements, required: boolean) => void;
  resetFieldRequirements: () => void;
}

const defaultFieldRequirements: FieldRequirements = {
  email: true,
  phone: false,
  address: false,
  birthDate: false,
  lastName: false,
  nickname: false,
};

const FieldRequirementsContext = createContext<FieldRequirementsContextType | undefined>(undefined);

export const FieldRequirementsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [fieldRequirements, setFieldRequirements] = useState<FieldRequirements>(() => {
    try {
      const savedRequirements = localStorage.getItem('fieldRequirements');
      return savedRequirements 
        ? JSON.parse(savedRequirements) 
        : defaultFieldRequirements;
    } catch (error) {
      console.error('Error loading field requirements from localStorage:', error);
      return defaultFieldRequirements;
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('fieldRequirements', JSON.stringify(fieldRequirements));
    } catch (error) {
      console.error('Error saving field requirements to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to save field requirements settings",
        variant: "destructive",
      });
    }
  }, [fieldRequirements]);

  const updateFieldRequirement = (field: keyof FieldRequirements, required: boolean) => {
    setFieldRequirements(prev => ({
      ...prev,
      [field]: required
    }));
  };

  const resetFieldRequirements = () => {
    setFieldRequirements(defaultFieldRequirements);
    toast({
      title: "Success",
      description: "Field requirements reset to defaults",
    });
  };

  return (
    <FieldRequirementsContext.Provider 
      value={{ 
        fieldRequirements, 
        updateFieldRequirement,
        resetFieldRequirements
      }}
    >
      {children}
    </FieldRequirementsContext.Provider>
  );
};

export const useFieldRequirements = (): FieldRequirementsContextType => {
  const context = useContext(FieldRequirementsContext);
  if (!context) {
    throw new Error('useFieldRequirements must be used within a FieldRequirementsProvider');
  }
  return context;
};
