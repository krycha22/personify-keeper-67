import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { TagType } from '@/components/people/PersonTag';

export interface Photo {
  url: string;
  description: string;
}

export interface Relationship {
  relatedPersonId: string;
  type: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  notes?: string;
  nickname?: string;
  tags?: {
    type: TagType;
    customLabel?: string;
  }[];
  isHidden?: boolean;
  photo?: string;
  photoDetails?: Photo[];
  photoAlbums: PhotoAlbum[];
  customFields: Record<string, any>;
  relationships: Relationship[];
  [key: string]: any;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required?: boolean;
  options?: string[];
}

export interface PhotoAlbum {
  id: string;
  name: string;
  photos: Photo[];
}

export const defaultPhotoAlbums: PhotoAlbum[] = [
  { id: 'album-me', name: 'Me', photos: [] },
  { id: 'album-general', name: 'General', photos: [] },
  { id: 'album-friends', name: 'Friends', photos: [] }
];

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
  addDefaultAlbum: (name: string) => void;
  getDefaultAlbums: () => PhotoAlbum[];
  addPhotoToGallery: (personId: string, photo: string, description: string, albumId?: string) => void;
  removePhotoFromGallery: (personId: string, photoIndex: number, albumId?: string) => void;
  updatePhotoDescription: (personId: string, photoIndex: number, description: string, albumId?: string) => void;
  addPhotoAlbum: (personId: string, albumName: string) => string;
  removePhotoAlbum: (personId: string, albumId: string) => void;
  renamePhotoAlbum: (personId: string, albumId: string, newName: string) => void;
  addRelationship: (personId: string, relatedPersonId: string, relationshipType: string) => void;
  removeRelationship: (personId: string, relatedPersonId: string) => void;
  addTagToPerson: (personId: string, tagType: TagType, customLabel?: string) => void;
  removeTagFromPerson: (personId: string, tagType: TagType) => void;
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
const DEFAULT_ALBUMS_KEY = 'personifykeeper_default_albums';

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [defaultAlbums, setDefaultAlbums] = useState<PhotoAlbum[]>(() => {
    const savedAlbums = localStorage.getItem(DEFAULT_ALBUMS_KEY);
    return savedAlbums ? JSON.parse(savedAlbums) : defaultPhotoAlbums;
  });
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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(customFields));
  }, [customFields]);
  
  useEffect(() => {
    localStorage.setItem(DEFAULT_ALBUMS_KEY, JSON.stringify(defaultAlbums));
  }, [defaultAlbums]);

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: generateId(),
      firstName: personData.firstName,
      lastName: personData.lastName,
      isHidden: false,
      photoAlbums: personData.photoAlbums || JSON.parse(JSON.stringify(defaultPhotoAlbums)),
      relationships: personData.relationships || [],
      customFields: personData.customFields || {},
      tags: personData.tags || []
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
    const visiblePeople = isAdmin() ? people : people.filter(person => !person.isHidden);
    
    if (!query) {
      return visiblePeople;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = visiblePeople.filter((person) => {
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
  
  const addDefaultAlbum = (name: string) => {
    const newAlbum: PhotoAlbum = {
      id: generateId(),
      name,
      photos: []
    };
    setDefaultAlbums((prev) => [...prev, newAlbum]);
  };
  
  const getDefaultAlbums = () => {
    return defaultAlbums;
  };

  const addPhotoToGallery = (personId: string, photoUrl: string, description: string, albumId?: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;

      if (albumId) {
        const updatedAlbums = person.photoAlbums.map(album => {
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
        const updatedAlbums = person.photoAlbums.map(album => {
          if (album.id === "album-general") {
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
      }
    }));
  };

  const removePhotoFromGallery = (personId: string, photoIndex: number, albumId?: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;

      if (albumId) {
        const updatedAlbums = person.photoAlbums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              photos: album.photos.filter((_, index) => index !== photoIndex)
            };
          }
          return album;
        });
        
        return {
          ...person,
          photoAlbums: updatedAlbums
        };
      } else {
        const updatedPhotoDetails = (person.photoDetails || []).filter((_, index) => index !== photoIndex);
        
        return {
          ...person,
          photoDetails: updatedPhotoDetails
        };
      }
    }));
  };

  const updatePhotoDescription = (personId: string, photoIndex: number, description: string, albumId?: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;

      if (albumId) {
        const updatedAlbums = person.photoAlbums.map(album => {
          if (album.id === albumId) {
            const updatedPhotos = [...album.photos];
            if (updatedPhotos[photoIndex]) {
              updatedPhotos[photoIndex] = {
                ...updatedPhotos[photoIndex],
                description
              };
            }
            
            return {
              ...album,
              photos: updatedPhotos
            };
          }
          return album;
        });
        
        return {
          ...person,
          photoAlbums: updatedAlbums
        };
      } else {
        const updatedPhotoDetails = [...(person.photoDetails || [])];
        if (updatedPhotoDetails[photoIndex]) {
          updatedPhotoDetails[photoIndex] = {
            ...updatedPhotoDetails[photoIndex],
            description
          };
        }
        
        return {
          ...person,
          photoDetails: updatedPhotoDetails
        };
      }
    }));
  };

  const addPhotoAlbum = (personId: string, albumName: string) => {
    const newAlbumId = `album-${generateId()}`;
    
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;
      
      return {
        ...person,
        photoAlbums: [
          ...person.photoAlbums,
          { id: newAlbumId, name: albumName, photos: [] }
        ]
      };
    }));
    
    return newAlbumId;
  };

  const removePhotoAlbum = (personId: string, albumId: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;
      
      return {
        ...person,
        photoAlbums: person.photoAlbums.filter(album => album.id !== albumId)
      };
    }));
  };

  const renamePhotoAlbum = (personId: string, albumId: string, newName: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;
      
      return {
        ...person,
        photoAlbums: person.photoAlbums.map(album => 
          album.id === albumId ? { ...album, name: newName } : album
        )
      };
    }));
  };

  const addRelationship = (personId: string, relatedPersonId: string, relationshipType: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;
      
      const relationshipExists = person.relationships.some(
        rel => rel.relatedPersonId === relatedPersonId
      );
      
      if (relationshipExists) return person;

      const newRelationship: Relationship = {
        relatedPersonId,
        type: relationshipType
      };
      
      return {
        ...person,
        relationships: [...person.relationships, newRelationship]
      };
    }));
  };

  const removeRelationship = (personId: string, relatedPersonId: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;
      
      return {
        ...person,
        relationships: person.relationships.filter(rel => rel.relatedPersonId !== relatedPersonId)
      };
    }));
  };

  const addTagToPerson = (personId: string, tagType: TagType, customLabel?: string) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id !== personId) return person;
        
        const existingTagIndex = person.tags?.findIndex(tag => tag.type === tagType);
        
        if (existingTagIndex !== undefined && existingTagIndex >= 0) {
          const updatedTags = [...(person.tags || [])];
          updatedTags[existingTagIndex] = { type: tagType, customLabel };
          
          return { ...person, tags: updatedTags };
        } else {
          const updatedTags = [...(person.tags || []), { type: tagType, customLabel }];
          return { ...person, tags: updatedTags };
        }
      })
    );
  };

  const removeTagFromPerson = (personId: string, tagType: TagType) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id !== personId) return person;
        
        const updatedTags = person.tags?.filter(tag => tag.type !== tagType) || [];
        
        return { ...person, tags: updatedTags };
      })
    );
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <PeopleContext.Provider
      value={{
        people: isAdmin() ? people : people.filter(person => !person.isHidden),
        customFields,
        addPerson,
        updatePerson,
        deletePerson,
        getPerson,
        searchPeople,
        addCustomField,
        deleteCustomField,
        togglePersonVisibility,
        addDefaultAlbum,
        getDefaultAlbums,
        addPhotoToGallery,
        removePhotoFromGallery,
        updatePhotoDescription,
        addPhotoAlbum,
        removePhotoAlbum,
        renamePhotoAlbum,
        addRelationship,
        removeRelationship,
        addTagToPerson,
        removeTagFromPerson
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
