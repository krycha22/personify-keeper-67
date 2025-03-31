
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  notes?: string;
  nickname?: string;
  tags?: string[];
  isHidden?: boolean;
  [key: string]: any;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required?: boolean;
}

interface PeopleContextType {
  people: Person[];
  customFields: CustomField[];
  addPerson: (person: Omit<Person, 'id'>) => Person;
  updatePerson: (id: string, personData: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  searchPeople: (query: string) => Person[];
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  deleteCustomField: (id: string) => void;
  togglePersonVisibility: (id: string) => void;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (context === undefined) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
};

const LOCAL_STORAGE_KEY = 'personifykeeper_people';
const CUSTOM_FIELDS_KEY = 'personifykeeper_custom_fields';

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const savedPeople = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    }

    const savedCustomFields = localStorage.getItem(CUSTOM_FIELDS_KEY);
    if (savedCustomFields) {
      setCustomFields(JSON.parse(savedCustomFields));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(customFields));
  }, [customFields]);

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: generateId(),
      isHidden: false
    };
    setPeople((prev) => [...prev, newPerson]);
    return newPerson;
  };

  const updatePerson = (id: string, personData: Partial<Person>) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, ...personData } : person
      )
    );
  };

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const getPerson = (id: string) => {
    return people.find((person) => person.id === id);
  };

  const togglePersonVisibility = (id: string) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, isHidden: !person.isHidden } : person
      )
    );
  };

  const searchPeople = (query: string) => {
    if (!query) {
      // If user is not admin, don't show hidden profiles
      return isAdmin() ? people : people.filter((person) => !person.isHidden);
    }

    const lowerQuery = query.toLowerCase();
    const filtered = people.filter((person) => {
      // If user is not admin and profile is hidden, don't show it
      if (!isAdmin() && person.isHidden) {
        return false;
      }

      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const nickname = person.nickname?.toLowerCase() || '';
      const email = person.email?.toLowerCase() || '';
      const phone = person.phone?.toLowerCase() || '';
      const tags = person.tags?.join(' ').toLowerCase() || '';

      return (
        fullName.includes(lowerQuery) ||
        nickname.includes(lowerQuery) ||
        email.includes(lowerQuery) ||
        phone.includes(lowerQuery) ||
        tags.includes(lowerQuery)
      );
    });

    return filtered;
  };

  const addCustomField = (field: Omit<CustomField, 'id'>) => {
    const newField: CustomField = {
      ...field,
      id: generateId()
    };
    setCustomFields((prev) => [...prev, newField]);
  };

  const deleteCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <PeopleContext.Provider
      value={{
        people,
        customFields,
        addPerson,
        updatePerson,
        deletePerson,
        getPerson,
        searchPeople,
        addCustomField,
        deleteCustomField,
        togglePersonVisibility
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
