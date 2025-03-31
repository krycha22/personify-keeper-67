
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  notes?: string;
  photo?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  tags?: string[];
  customFields: Record<string, string>;
  relationships: Array<{
    id: string;
    relatedPersonId: string;
    type: string;
  }>;
  photos?: string[];
  photoAlbums?: PhotoAlbum[];
  photoDetails?: PhotoDetail[];
  isHidden?: boolean;
};

export type PhotoDetail = {
  url: string;
  description?: string;
};

export type PhotoAlbum = {
  id: string;
  name: string;
  photos: PhotoDetail[];
};

export type CustomField = {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'checkbox' | 'select';
  required: boolean;
  isRequired?: boolean; // For backward compatibility
  options?: string[]; // For select type
};

interface PeopleContextType {
  people: Person[];
  customFields: CustomField[];
  addPerson: (person: Omit<Person, 'id'>) => Person;
  updatePerson: (id: string, person: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  searchPeople: (query: string) => Person[];
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  deleteCustomField: (id: string) => void;
  togglePersonVisibility: (id: string) => void;
  addRelationship: (personId: string, relatedPersonId: string, type: string) => void;
  removeRelationship: (personId: string, relatedPersonId: string) => void;
  // Photo gallery functions
  addPhotoToGallery: (personId: string, photoUrl: string, description: string, albumId?: string) => void;
  removePhotoFromGallery: (personId: string, index: number, albumId?: string) => void;
  updatePhotoDescription: (personId: string, index: number, description: string, albumId?: string) => void;
  addPhotoAlbum: (personId: string, name: string) => string;
  removePhotoAlbum: (personId: string, albumId: string) => void;
  renamePhotoAlbum: (personId: string, albumId: string, newName: string) => void;
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
  const { user, isAdmin } = useAuth();

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

  // Zapisywanie zmian do localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(customFields));
  }, [customFields]);

  const addPerson = (personData: Omit<Person, 'id'>): Person => {
    const newPerson = { ...personData, id: uuidv4() };
    setPeople((prev) => [...prev, newPerson]);
    return newPerson;
  };

  const updatePerson = (id: string, personData: Partial<Person>) => {
    setPeople((prev) =>
      prev.map((person) => (person.id === id ? { ...person, ...personData } : person))
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
        person.id === id 
          ? { ...person, isHidden: !person.isHidden }
          : person
      )
    );
  };

  const searchPeople = (query: string) => {
    if (!query) {
      // Jeśli użytkownik nie jest adminem, nie pokazuj ukrytych profili
      return isAdmin() 
        ? people 
        : people.filter(person => !person.isHidden);
    }

    const lowerQuery = query.toLowerCase();
    const filtered = people.filter((person) => {
      // Jeśli użytkownik nie jest adminem i profil jest ukryty, nie pokazuj go
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
    const newField = { ...field, id: uuidv4() };
    setCustomFields((prev) => [...prev, newField]);
  };

  const deleteCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
  };

  // Functions for handling relationships
  const addRelationship = (personId: string, relatedPersonId: string, type: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          const existingRelationship = person.relationships.find(
            (r) => r.relatedPersonId === relatedPersonId
          );
          
          if (existingRelationship) {
            return person;
          }
          
          return {
            ...person,
            relationships: [
              ...person.relationships,
              { 
                id: uuidv4(),
                relatedPersonId,
                type
              }
            ]
          };
        }
        return person;
      })
    );
  };

  const removeRelationship = (personId: string, relatedPersonId: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          return {
            ...person,
            relationships: person.relationships.filter(
              (r) => r.relatedPersonId !== relatedPersonId
            )
          };
        }
        return person;
      })
    );
  };

  // Photo gallery functions
  const addPhotoToGallery = (personId: string, photoUrl: string, description: string, albumId?: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          if (albumId) {
            // Add to specific album
            const photoAlbums = person.photoAlbums || [];
            const updatedAlbums = photoAlbums.map((album) => {
              if (album.id === albumId) {
                return {
                  ...album,
                  photos: [...album.photos, { url: photoUrl, description }]
                };
              }
              return album;
            });
            
            return {
              ...person,
              photoAlbums: updatedAlbums
            };
          } else {
            // Add to general photos
            const photoDetails = person.photoDetails || [];
            return {
              ...person,
              photos: [...(person.photos || []), photoUrl],
              photoDetails: [...photoDetails, { url: photoUrl, description }]
            };
          }
        }
        return person;
      })
    );
  };
  
  const removePhotoFromGallery = (personId: string, index: number, albumId?: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          if (albumId) {
            // Remove from specific album
            const photoAlbums = person.photoAlbums || [];
            const updatedAlbums = photoAlbums.map((album) => {
              if (album.id === albumId) {
                const updatedPhotos = [...album.photos];
                updatedPhotos.splice(index, 1);
                return { ...album, photos: updatedPhotos };
              }
              return album;
            });
            
            return { ...person, photoAlbums: updatedAlbums };
          } else {
            // Remove from general photos
            const updatedPhotos = [...(person.photos || [])];
            const updatedPhotoDetails = [...(person.photoDetails || [])];
            updatedPhotos.splice(index, 1);
            updatedPhotoDetails.splice(index, 1);
            
            return { 
              ...person, 
              photos: updatedPhotos,
              photoDetails: updatedPhotoDetails
            };
          }
        }
        return person;
      })
    );
  };
  
  const updatePhotoDescription = (personId: string, index: number, description: string, albumId?: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          if (albumId) {
            // Update in specific album
            const photoAlbums = person.photoAlbums || [];
            const updatedAlbums = photoAlbums.map((album) => {
              if (album.id === albumId && album.photos[index]) {
                const updatedPhotos = [...album.photos];
                updatedPhotos[index] = { ...updatedPhotos[index], description };
                return { ...album, photos: updatedPhotos };
              }
              return album;
            });
            
            return { ...person, photoAlbums: updatedAlbums };
          } else {
            // Update in general photos
            const updatedPhotoDetails = [...(person.photoDetails || [])];
            if (updatedPhotoDetails[index]) {
              updatedPhotoDetails[index] = { ...updatedPhotoDetails[index], description };
            }
            
            return { ...person, photoDetails: updatedPhotoDetails };
          }
        }
        return person;
      })
    );
  };
  
  const addPhotoAlbum = (personId: string, name: string): string => {
    const albumId = `album-${uuidv4()}`;
    
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          const photoAlbums = person.photoAlbums || [];
          return {
            ...person,
            photoAlbums: [...photoAlbums, { id: albumId, name, photos: [] }]
          };
        }
        return person;
      })
    );
    
    return albumId;
  };
  
  const removePhotoAlbum = (personId: string, albumId: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          const photoAlbums = person.photoAlbums || [];
          return {
            ...person,
            photoAlbums: photoAlbums.filter((album) => album.id !== albumId)
          };
        }
        return person;
      })
    );
  };
  
  const renamePhotoAlbum = (personId: string, albumId: string, newName: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          const photoAlbums = person.photoAlbums || [];
          const updatedAlbums = photoAlbums.map((album) => {
            if (album.id === albumId) {
              return { ...album, name: newName };
            }
            return album;
          });
          
          return { ...person, photoAlbums: updatedAlbums };
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
        deleteCustomField,
        togglePersonVisibility,
        addRelationship,
        removeRelationship,
        addPhotoToGallery,
        removePhotoFromGallery,
        updatePhotoDescription,
        addPhotoAlbum,
        removePhotoAlbum,
        renamePhotoAlbum
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
