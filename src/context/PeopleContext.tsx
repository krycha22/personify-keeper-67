import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveJsonFile, loadJsonFile, saveBinaryFile, base64ToBlob } from '@/utils/fileStorage';
import { useToast } from "@/hooks/use-toast";

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
  tags?: string[];
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
  isFileStorageInitialized: boolean;
  setFileStorageInitialized: (initialized: boolean) => void;
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
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (context === undefined) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
};

const PEOPLE_FILE = 'people.json';
const CUSTOM_FIELDS_FILE = 'custom_fields.json';
const DEFAULT_ALBUMS_FILE = 'default_albums.json';

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [defaultAlbums, setDefaultAlbums] = useState<PhotoAlbum[]>(defaultPhotoAlbums);
  const [isFileStorageInitialized, setFileStorageInitialized] = useState<boolean>(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (isFileStorageInitialized) {
        try {
          const loadedPeople = await loadJsonFile<Person[]>(PEOPLE_FILE, 'people', []);
          setPeople(loadedPeople);

          const loadedCustomFields = await loadJsonFile<CustomField[]>(CUSTOM_FIELDS_FILE, 'settings', []);
          setCustomFields(loadedCustomFields);

          const loadedDefaultAlbums = await loadJsonFile<PhotoAlbum[]>(DEFAULT_ALBUMS_FILE, 'settings', defaultPhotoAlbums);
          setDefaultAlbums(loadedDefaultAlbums);
        } catch (error) {
          console.error("Error loading data from files:", error);
          toast({
            title: "Error loading data",
            description: "Could not load data from files. Using default values.",
            variant: "destructive",
          });
        }
      } else {
        const savedPeople = localStorage.getItem('personifykeeper_people');
        if (savedPeople) {
          setPeople(JSON.parse(savedPeople));
        }

        const savedCustomFields = localStorage.getItem('personifykeeper_custom_fields');
        if (savedCustomFields) {
          setCustomFields(JSON.parse(savedCustomFields));
        }

        const savedDefaultAlbums = localStorage.getItem('personifykeeper_default_albums');
        if (savedDefaultAlbums) {
          setDefaultAlbums(JSON.parse(savedDefaultAlbums));
        }
      }
    };

    loadData();
  }, [isFileStorageInitialized]);

  useEffect(() => {
    const saveData = async () => {
      if (isFileStorageInitialized) {
        await saveJsonFile(PEOPLE_FILE, people, 'people');
      } else {
        localStorage.setItem('personifykeeper_people', JSON.stringify(people));
      }
    };

    if (people.length > 0) {
      saveData();
    }
  }, [people, isFileStorageInitialized]);

  useEffect(() => {
    const saveData = async () => {
      if (isFileStorageInitialized) {
        await saveJsonFile(CUSTOM_FIELDS_FILE, customFields, 'settings');
      } else {
        localStorage.setItem('personifykeeper_custom_fields', JSON.stringify(customFields));
      }
    };

    if (customFields.length > 0) {
      saveData();
    }
  }, [customFields, isFileStorageInitialized]);

  useEffect(() => {
    const saveData = async () => {
      if (isFileStorageInitialized) {
        await saveJsonFile(DEFAULT_ALBUMS_FILE, defaultAlbums, 'settings');
      } else {
        localStorage.setItem('personifykeeper_default_albums', JSON.stringify(defaultAlbums));
      }
    };

    saveData();
  }, [defaultAlbums, isFileStorageInitialized]);

  const savePhotoToFile = async (photoData: string): Promise<string> => {
    if (isFileStorageInitialized) {
      const photoId = generateId();
      const fileName = `${photoId}.jpg`;
      const photoBlob = base64ToBlob(photoData);
      await saveBinaryFile(fileName, photoBlob, 'photos');
      return fileName;
    }
    return photoData;
  };

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: generateId(),
      firstName: personData.firstName,
      lastName: personData.lastName,
      isHidden: false,
      photoAlbums: personData.photoAlbums || JSON.parse(JSON.stringify(defaultAlbums)),
      relationships: personData.relationships || []
    };
    
    if (isFileStorageInitialized && newPerson.photo) {
      savePhotoToFile(newPerson.photo).then((photoFileName) => {
        newPerson.photo = photoFileName;
        setPeople((prev) => [...prev, newPerson]);
      });
    } else {
      setPeople((prev) => [...prev, newPerson]);
    }
    
    return newPerson;
  };

  const updatePerson = (id: string, personData: Partial<Person>) => {
    const updatedData = { ...personData };
    
    if (isFileStorageInitialized && personData.photo && personData.photo.startsWith('data:')) {
      savePhotoToFile(personData.photo).then((photoFileName) => {
        setPeople((prev) =>
          prev.map((person) =>
            person.id === id ? { ...person, ...updatedData, photo: photoFileName } : person
          )
        );
      });
    } else {
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, ...updatedData } : person
        )
      );
    }
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

  const addPhotoToGallery = async (personId: string, photoUrl: string, description: string, albumId?: string) => {
    let finalPhotoUrl = photoUrl;
    
    if (isFileStorageInitialized && photoUrl.startsWith('data:')) {
      finalPhotoUrl = await savePhotoToFile(photoUrl);
    }
    
    setPeople(prev => prev.map(person => {
      if (person.id !== personId) return person;

      if (albumId) {
        const updatedAlbums = person.photoAlbums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              photos: [...album.photos, { url: finalPhotoUrl, description }]
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
              photos: [...album.photos, { url: finalPhotoUrl, description }]
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

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <PeopleContext.Provider
      value={{
        people: isAdmin() ? people : people.filter(person => !person.isHidden),
        customFields,
        isFileStorageInitialized,
        setFileStorageInitialized,
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
        removeRelationship
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
