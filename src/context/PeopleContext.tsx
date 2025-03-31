import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { TagType } from '@/components/people/PersonTag';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
  addPerson: (person: Omit<Person, 'id'>) => Promise<Person>;
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
  addPhotoAlbum: (personId: string, albumName: string) => Promise<string>;
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

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [defaultAlbums, setDefaultAlbums] = useState<PhotoAlbum[]>(defaultPhotoAlbums);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const { data, error } = await supabase
          .from('people')
          .select('*');
        
        if (error) {
          console.error("Error fetching people:", error);
          toast.error("Could not load people data");
          return;
        }
        
        if (data) {
          const transformedPeople: Person[] = data.map(person => ({
            id: person.id,
            firstName: person.first_name,
            lastName: person.last_name,
            email: person.email,
            phone: person.phone,
            address: person.address,
            birthDate: person.birth_date,
            notes: person.notes,
            nickname: person.nickname,
            isHidden: person.is_hidden,
            photo: person.photo,
            photoDetails: [],
            photoAlbums: Array.isArray(person.photo_albums) 
              ? person.photo_albums 
              : defaultPhotoAlbums,
            customFields: typeof person.custom_fields === 'object' 
              ? person.custom_fields 
              : {},
            relationships: Array.isArray(person.relationships) 
              ? person.relationships 
              : [],
            tags: Array.isArray(person.tags) 
              ? person.tags 
              : []
          }));
          
          setPeople(transformedPeople);
        }
      } catch (error) {
        console.error("Failed to fetch people:", error);
        toast.error("Could not connect to database");
      }
    };
    
    fetchPeople();
  }, []);

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_fields')
          .select('*');
        
        if (error) {
          console.error("Error fetching custom fields:", error);
          toast.error("Could not load custom fields");
          return;
        }
        
        const transformedFields = data.map(field => ({
          id: field.id,
          name: field.name,
          type: field.type as 'text' | 'number' | 'date' | 'boolean',
          required: field.required || false,
          options: field.options as string[] || []
        }));
        
        setCustomFields(transformedFields);
      } catch (error) {
        console.error("Failed to fetch custom fields:", error);
      }
    };
    
    fetchCustomFields();
  }, []);

  useEffect(() => {
    const fetchDefaultAlbums = async () => {
      try {
        const { data, error } = await supabase
          .from('default_photo_albums')
          .select('*');
        
        if (error) {
          console.error("Error fetching default albums:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const transformedAlbums = data.map(album => ({
            id: album.id,
            name: album.name,
            photos: []
          }));
          
          setDefaultAlbums(transformedAlbums);
        }
      } catch (error) {
        console.error("Failed to fetch default albums:", error);
      }
    };
    
    fetchDefaultAlbums();
  }, []);

  const addPerson = async (personData: Omit<Person, 'id'>): Promise<Person> => {
    try {
      const supabaseData = {
        first_name: personData.firstName,
        last_name: personData.lastName,
        email: personData.email,
        phone: personData.phone,
        address: personData.address,
        birth_date: personData.birthDate,
        notes: personData.notes,
        nickname: personData.nickname,
        photo: personData.photo,
        is_hidden: false,
        custom_fields: personData.customFields || {},
        photo_albums: personData.photoAlbums || defaultPhotoAlbums,
        relationships: personData.relationships || [],
        tags: personData.tags || []
      };
      
      const { data, error } = await supabase
        .from('people')
        .insert(supabaseData)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding person:", error);
        toast.error("Could not add person");
        
        const fallbackPerson: Person = {
          ...personData,
          id: generateId(),
          isHidden: false,
          photoAlbums: personData.photoAlbums || JSON.parse(JSON.stringify(defaultPhotoAlbums)),
          relationships: personData.relationships || [],
          customFields: personData.customFields || {},
          tags: personData.tags || []
        };
        
        setPeople((prev) => [...prev, fallbackPerson]);
        return fallbackPerson;
      }
      
      const newPerson: Person = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        birthDate: data.birth_date,
        notes: data.notes,
        nickname: data.nickname,
        isHidden: data.is_hidden,
        photo: data.photo,
        photoDetails: [],
        photoAlbums: Array.isArray(data.photo_albums) 
          ? data.photo_albums 
          : defaultPhotoAlbums,
        customFields: typeof data.custom_fields === 'object' 
          ? data.custom_fields 
          : {},
        relationships: Array.isArray(data.relationships) 
          ? data.relationships 
          : [],
        tags: Array.isArray(data.tags) 
          ? data.tags 
          : []
      };
      
      setPeople((prev) => [...prev, newPerson]);
      return newPerson;
    } catch (error) {
      console.error("Failed to add person:", error);
      toast.error("Failed to add person");
      
      const newPerson: Person = {
        ...personData,
        id: generateId(),
        isHidden: false,
        photoAlbums: personData.photoAlbums || JSON.parse(JSON.stringify(defaultPhotoAlbums)),
        relationships: personData.relationships || [],
        customFields: personData.customFields || {},
        tags: personData.tags || []
      };
      
      setPeople((prev) => [...prev, newPerson]);
      return newPerson;
    }
  };

  const updatePerson = async (id: string, personData: Partial<Person>) => {
    try {
      const supabaseData: any = {};
      
      if (personData.firstName !== undefined) supabaseData.first_name = personData.firstName;
      if (personData.lastName !== undefined) supabaseData.last_name = personData.lastName;
      if (personData.email !== undefined) supabaseData.email = personData.email;
      if (personData.phone !== undefined) supabaseData.phone = personData.phone;
      if (personData.address !== undefined) supabaseData.address = personData.address;
      if (personData.birthDate !== undefined) supabaseData.birth_date = personData.birthDate;
      if (personData.notes !== undefined) supabaseData.notes = personData.notes;
      if (personData.nickname !== undefined) supabaseData.nickname = personData.nickname;
      if (personData.isHidden !== undefined) supabaseData.is_hidden = personData.isHidden;
      if (personData.photo !== undefined) supabaseData.photo = personData.photo;
      if (personData.photoAlbums !== undefined) supabaseData.photo_albums = personData.photoAlbums;
      if (personData.customFields !== undefined) supabaseData.custom_fields = personData.customFields;
      if (personData.relationships !== undefined) supabaseData.relationships = personData.relationships;
      if (personData.tags !== undefined) supabaseData.tags = personData.tags;
      
      supabaseData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('people')
        .update(supabaseData)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating person:", error);
        toast.error("Could not update person");
      }
      
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, ...personData } : person
        )
      );
    } catch (error) {
      console.error("Failed to update person:", error);
      toast.error("Failed to update person");
      
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, ...personData } : person
        )
      );
    }
  };

  const deletePerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting person:", error);
        toast.error("Could not delete person");
      }
      
      setPeople((prev) => prev.filter((person) => person.id !== id));
    } catch (error) {
      console.error("Failed to delete person:", error);
      toast.error("Failed to delete person");
      
      setPeople((prev) => prev.filter((person) => person.id !== id));
    }
  };

  const getPerson = (id: string) => {
    return people.find((person) => person.id === id);
  };

  const togglePersonVisibility = async (id: string) => {
    const person = people.find(p => p.id === id);
    if (!person) return;
    
    const newVisibility = !person.isHidden;
    
    try {
      const { error } = await supabase
        .from('people')
        .update({ is_hidden: newVisibility })
        .eq('id', id);
      
      if (error) {
        console.error("Error toggling visibility:", error);
        toast.error("Could not update visibility");
      }
      
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, isHidden: newVisibility } : person
        )
      );
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      toast.error("Failed to update visibility");
      
      setPeople((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, isHidden: newVisibility } : person
        )
      );
    }
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
      const tags = person.tags?.length ? person.tags.map(tag => tag.type).join(' ').toLowerCase() : '';

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

  const addCustomField = async (field: Omit<CustomField, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          name: field.name,
          type: field.type,
          required: field.required || false,
          options: field.options || []
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding custom field:", error);
        toast.error("Could not add custom field");
        
        const newField: CustomField = {
          ...field,
          id: generateId()
        };
        setCustomFields((prev) => [...prev, newField]);
        return;
      }
      
      const newField: CustomField = {
        id: data.id,
        name: data.name,
        type: data.type as 'text' | 'number' | 'date' | 'boolean',
        required: data.required || false,
        options: data.options as string[] || []
      };
      
      setCustomFields((prev) => [...prev, newField]);
    } catch (error) {
      console.error("Failed to add custom field:", error);
      toast.error("Failed to add custom field");
      
      const newField: CustomField = {
        ...field,
        id: generateId()
      };
      setCustomFields((prev) => [...prev, newField]);
    }
  };

  const deleteCustomField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting custom field:", error);
        toast.error("Could not delete custom field");
      }
      
      setCustomFields((prev) => prev.filter((field) => field.id !== id));
    } catch (error) {
      console.error("Failed to delete custom field:", error);
      toast.error("Failed to delete custom field");
      
      setCustomFields((prev) => prev.filter((field) => field.id !== id));
    }
  };
  
  const addDefaultAlbum = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('default_photo_albums')
        .insert({ name })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding default album:", error);
        toast.error("Could not add album");
        
        const newAlbum: PhotoAlbum = {
          id: generateId(),
          name,
          photos: []
        };
        setDefaultAlbums((prev) => [...prev, newAlbum]);
        return;
      }
      
      const newAlbum: PhotoAlbum = {
        id: data.id,
        name: data.name,
        photos: []
      };
      
      setDefaultAlbums((prev) => [...prev, newAlbum]);
    } catch (error) {
      console.error("Failed to add default album:", error);
      toast.error("Failed to add album");
      
      const newAlbum: PhotoAlbum = {
        id: generateId(),
        name,
        photos: []
      };
      setDefaultAlbums((prev) => [...prev, newAlbum]);
    }
  };
  
  const getDefaultAlbums = () => {
    return defaultAlbums;
  };

  const addPhotoToGallery = async (personId: string, photoUrl: string, description: string, albumId?: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const updatedAlbums = person.photoAlbums.map(album => {
      if (!albumId && album.id === "album-general") {
        return {
          ...album,
          photos: [...album.photos, { url: photoUrl, description }]
        };
      } else if (albumId && album.id === albumId) {
        return {
          ...album,
          photos: [...album.photos, { url: photoUrl, description }]
        };
      }
      return album;
    });
    
    await updatePerson(personId, { photoAlbums: updatedAlbums });
  };

  const removePhotoFromGallery = async (personId: string, photoIndex: number, albumId?: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
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
      
      await updatePerson(personId, { photoAlbums: updatedAlbums });
    } else {
      const updatedPhotoDetails = (person.photoDetails || []).filter((_, index) => index !== photoIndex);
      await updatePerson(personId, { photoDetails: updatedPhotoDetails });
    }
  };

  const updatePhotoDescription = async (personId: string, photoIndex: number, description: string, albumId?: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
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
      
      await updatePerson(personId, { photoAlbums: updatedAlbums });
    } else {
      const updatedPhotoDetails = [...(person.photoDetails || [])];
      if (updatedPhotoDetails[photoIndex]) {
        updatedPhotoDetails[photoIndex] = {
          ...updatedPhotoDetails[photoIndex],
          description
        };
      }
      
      await updatePerson(personId, { photoDetails: updatedPhotoDetails });
    }
  };

  const addPhotoAlbum = async (personId: string, albumName: string): Promise<string> => {
    const person = people.find(p => p.id === personId);
    if (!person) return '';
    
    const newAlbumId = `album-${generateId()}`;
    const updatedPhotoAlbums = [
      ...person.photoAlbums,
      { id: newAlbumId, name: albumName, photos: [] }
    ];
    
    await updatePerson(personId, { photoAlbums: updatedPhotoAlbums });
    
    return newAlbumId;
  };

  const removePhotoAlbum = async (personId: string, albumId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const updatedPhotoAlbums = person.photoAlbums.filter(album => album.id !== albumId);
    
    await updatePerson(personId, { photoAlbums: updatedPhotoAlbums });
  };

  const renamePhotoAlbum = async (personId: string, albumId: string, newName: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const updatedPhotoAlbums = person.photoAlbums.map(album => 
      album.id === albumId ? { ...album, name: newName } : album
    );
    
    await updatePerson(personId, { photoAlbums: updatedPhotoAlbums });
  };

  const addRelationship = async (personId: string, relatedPersonId: string, relationshipType: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const relationshipExists = person.relationships.some(
      rel => rel.relatedPersonId === relatedPersonId
    );
    
    if (relationshipExists) return;
    
    const newRelationship: Relationship = {
      relatedPersonId,
      type: relationshipType
    };
    
    const updatedRelationships = [...person.relationships, newRelationship];
    await updatePerson(personId, { relationships: updatedRelationships });
  };

  const removeRelationship = async (personId: string, relatedPersonId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const updatedRelationships = person.relationships.filter(
      rel => rel.relatedPersonId !== relatedPersonId
    );
    
    await updatePerson(personId, { relationships: updatedRelationships });
  };

  const addTagToPerson = async (personId: string, tagType: TagType, customLabel?: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const existingTagIndex = person.tags?.findIndex(tag => tag.type === tagType);
    let updatedTags;
    
    if (existingTagIndex !== undefined && existingTagIndex >= 0) {
      updatedTags = [...(person.tags || [])];
      updatedTags[existingTagIndex] = { type: tagType, customLabel };
    } else {
      updatedTags = [...(person.tags || []), { type: tagType, customLabel }];
    }
    
    await updatePerson(personId, { tags: updatedTags });
  };

  const removeTagFromPerson = async (personId: string, tagType: TagType) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    
    const updatedTags = person.tags?.filter(tag => tag.type !== tagType) || [];
    await updatePerson(personId, { tags: updatedTags });
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
