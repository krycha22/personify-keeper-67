import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'checkbox' | 'select';
  options?: string[];
  isRequired: boolean;
}

export interface Relationship {
  personId: string;
  relatedPersonId: string;
  type: string;
}

export interface PhotoDetail {
  url: string;
  description: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  photo?: string;
  photoDetails?: PhotoDetail[];
  photos?: string[]; // For backward compatibility
  notes?: string;
  customFields: Record<string, any>;
  relationships: Relationship[];
  createdAt: string;
  updatedAt: string;
}

interface PeopleContextType {
  people: Person[];
  customFields: CustomField[];
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePerson: (id: string, person: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  searchPeople: (query: string) => Person[];
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  updateCustomField: (id: string, field: Partial<CustomField>) => void;
  deleteCustomField: (id: string) => void;
  addRelationship: (personId: string, relatedPersonId: string, type: string) => void;
  removeRelationship: (personId: string, relatedPersonId: string) => void;
  addPhotoToGallery: (personId: string, photoBase64: string, description: string) => void;
  removePhotoFromGallery: (personId: string, photoIndex: number) => void;
  updatePhotoDescription: (personId: string, photoIndex: number, description: string) => void;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

const defaultCustomFields: CustomField[] = [
  { id: "field-1", name: "Job Title", type: "text", isRequired: false },
  { id: "field-2", name: "Company", type: "text", isRequired: false },
];

export const PeopleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultCustomFields);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedPeople = localStorage.getItem('people');
      const savedCustomFields = localStorage.getItem('customFields');

      if (savedPeople) {
        const parsedPeople = JSON.parse(savedPeople);
        const migratedPeople = parsedPeople.map((person: Person) => {
          if (!person.photoDetails && (person.photos || person.photo)) {
            const photos = person.photos || (person.photo ? [person.photo] : []);
            return {
              ...person,
              photoDetails: photos.map(url => ({ url, description: '' }))
            };
          }
          return person;
        });
        setPeople(migratedPeople);
      }

      if (savedCustomFields) {
        setCustomFields(JSON.parse(savedCustomFields));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to load saved data",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('people', JSON.stringify(people));
    } catch (error) {
      console.error('Error saving people to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to save people data",
        variant: "destructive",
      });
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem('customFields', JSON.stringify(customFields));
    } catch (error) {
      console.error('Error saving customFields to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to save custom fields",
        variant: "destructive",
      });
    }
  }, [customFields]);

  const addPerson = (personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `person-${Date.now()}`;
    const now = new Date().toISOString();
    
    let photoDetails: PhotoDetail[] = [];
    
    if (personData.photoDetails) {
      photoDetails = personData.photoDetails;
    } else if (personData.photos && personData.photos.length > 0) {
      photoDetails = personData.photos.map(url => ({ url, description: '' }));
    } else if (personData.photo) {
      photoDetails = [{ url: personData.photo, description: '' }];
    }
    
    const newPerson: Person = {
      ...personData,
      id,
      photoDetails,
      createdAt: now,
      updatedAt: now,
    };
    
    setPeople(prevPeople => [...prevPeople, newPerson]);
    toast({
      title: "Success",
      description: "Person added successfully",
    });
    
    return id;
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople(prevPeople => 
      prevPeople.map(person => 
        person.id === id 
          ? { 
              ...person, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : person
      )
    );
    toast({
      title: "Success",
      description: "Person updated successfully",
    });
  };

  const deletePerson = (id: string) => {
    setPeople(prevPeople => {
      const updatedPeople = [...prevPeople];
      
      const filteredPeople = updatedPeople.filter(person => person.id !== id);
      
      return filteredPeople.map(person => {
        if (person.relationships.some(r => r.relatedPersonId === id)) {
          return {
            ...person,
            relationships: person.relationships.filter(r => r.relatedPersonId !== id),
            updatedAt: new Date().toISOString()
          };
        }
        return person;
      });
    });
    
    toast({
      title: "Success",
      description: "Person deleted successfully",
    });
  };

  const getPerson = (id: string) => {
    return people.find(person => person.id === id);
  };

  const searchPeople = (query: string) => {
    if (!query) return people;
    
    const lowerQuery = query.toLowerCase();
    return people.filter(person => 
      person.firstName.toLowerCase().includes(lowerQuery) ||
      person.lastName.toLowerCase().includes(lowerQuery) ||
      (person.nickname && person.nickname.toLowerCase().includes(lowerQuery)) ||
      person.email.toLowerCase().includes(lowerQuery) ||
      (person.phone && person.phone.includes(query)) ||
      (person.address && person.address.toLowerCase().includes(lowerQuery)) ||
      (person.notes && person.notes.toLowerCase().includes(lowerQuery)) ||
      Object.entries(person.customFields).some(([_, value]) => 
        value && String(value).toLowerCase().includes(lowerQuery)
      )
    );
  };

  const addCustomField = (field: Omit<CustomField, 'id'>) => {
    const id = `field-${Date.now()}`;
    const newField: CustomField = { ...field, id };
    setCustomFields(prevFields => [...prevFields, newField]);
    toast({
      title: "Success",
      description: "Custom field added successfully",
    });
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(prevFields => 
      prevFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
    toast({
      title: "Success",
      description: "Custom field updated successfully",
    });
  };

  const deleteCustomField = (id: string) => {
    setCustomFields(prevFields => prevFields.filter(field => field.id !== id));
    
    setPeople(prevPeople => 
      prevPeople.map(person => {
        const { [id]: _, ...remainingCustomFields } = person.customFields;
        return {
          ...person,
          customFields: remainingCustomFields,
          updatedAt: new Date().toISOString()
        };
      })
    );
    
    toast({
      title: "Success",
      description: "Custom field deleted successfully",
    });
  };

  const addRelationship = (personId: string, relatedPersonId: string, type: string) => {
    if (personId === relatedPersonId) {
      toast({
        title: "Error",
        description: "Cannot create a relationship with the same person",
        variant: "destructive",
      });
      return;
    }

    setPeople(prevPeople => {
      const personToUpdate = prevPeople.find(p => p.id === personId);
      if (personToUpdate?.relationships.some(r => r.relatedPersonId === relatedPersonId)) {
        toast({
          title: "Info",
          description: "This relationship already exists",
        });
        return prevPeople;
      }

      return prevPeople.map(person => {
        if (person.id === personId) {
          return {
            ...person,
            relationships: [
              ...person.relationships,
              { personId, relatedPersonId, type }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        
        if (person.id === relatedPersonId) {
          return {
            ...person,
            relationships: [
              ...person.relationships,
              { personId: relatedPersonId, relatedPersonId: personId, type }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        
        return person;
      });
    });
    
    toast({
      title: "Success",
      description: "Relationship added successfully",
    });
  };

  const removeRelationship = (personId: string, relatedPersonId: string) => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.id === personId) {
          return {
            ...person,
            relationships: person.relationships.filter(
              r => !(r.personId === personId && r.relatedPersonId === relatedPersonId)
            ),
            updatedAt: new Date().toISOString()
          };
        }
        
        if (person.id === relatedPersonId) {
          return {
            ...person,
            relationships: person.relationships.filter(
              r => !(r.personId === relatedPersonId && r.relatedPersonId === personId)
            ),
            updatedAt: new Date().toISOString()
          };
        }
        
        return person;
      })
    );
    
    toast({
      title: "Success",
      description: "Relationship removed successfully",
    });
  };

  const addPhotoToGallery = (personId: string, photoBase64: string, description: string) => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.id === personId) {
          const updatedPhotoDetails = person.photoDetails 
            ? [...person.photoDetails, { url: photoBase64, description }] 
            : [{ url: photoBase64, description }];
          
          return {
            ...person,
            photoDetails: updatedPhotoDetails,
            updatedAt: new Date().toISOString()
          };
        }
        return person;
      })
    );
    
    toast({
      title: "Success",
      description: "Photo added to gallery successfully",
    });
  };

  const removePhotoFromGallery = (personId: string, photoIndex: number) => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.id === personId && person.photoDetails) {
          const updatedPhotoDetails = [...person.photoDetails];
          updatedPhotoDetails.splice(photoIndex, 1);
          
          return {
            ...person,
            photoDetails: updatedPhotoDetails,
            photo: photoIndex === 0 && updatedPhotoDetails.length === 0 ? undefined : person.photo,
            updatedAt: new Date().toISOString()
          };
        }
        return person;
      })
    );
    
    toast({
      title: "Success",
      description: "Photo removed from gallery successfully",
    });
  };

  const updatePhotoDescription = (personId: string, photoIndex: number, description: string) => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.id === personId && person.photoDetails && person.photoDetails[photoIndex]) {
          const updatedPhotoDetails = [...person.photoDetails];
          updatedPhotoDetails[photoIndex] = {
            ...updatedPhotoDetails[photoIndex],
            description
          };
          
          return {
            ...person,
            photoDetails: updatedPhotoDetails,
            updatedAt: new Date().toISOString()
          };
        }
        return person;
      })
    );
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
        updateCustomField,
        deleteCustomField,
        addRelationship,
        removeRelationship,
        addPhotoToGallery,
        removePhotoFromGallery,
        updatePhotoDescription
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = (): PeopleContextType => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
};
