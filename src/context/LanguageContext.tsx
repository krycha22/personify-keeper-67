import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  language: 'en' | 'pl';
  setLanguage: (language: 'en' | 'pl') => void;
  t: (key: string, args?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    nav: {
      people: 'People',
      settings: 'Settings',
    },
    common: {
      yes: 'Yes',
      no: 'No',
    },
    fields: {
      firstName: 'First Name',
      lastName: 'Last Name',
      nickname: 'Nickname',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      birthDate: 'Birth Date',
      notes: 'Notes',
      photo: 'Photo',
      basicInfo: 'Basic Info',
      additionalInfo: 'Additional Info',
    },
    customFields: {
      noFields: 'No custom fields added yet.',
      name: 'Name',
      type: 'Type',
      options: 'Options (comma-separated)',
      isRequired: 'Is Required',
      add: 'Add Custom Field',
      edit: 'Edit Custom Field',
      deleteConfirmation: 'Are you sure you want to delete this field? This will remove the field and all associated data from every person.',
    },
    person: {
      add: 'Add Person',
      edit: 'Edit Person',
      view: 'View Person',
      addTagline: 'Add a new person to your directory',
      editTagline: 'Edit an existing person in your directory',
      profileInformation: 'Profile Information',
      notFound: 'Person Not Found',
      notFoundMessage: 'The person you are looking for does not exist.',
      backButton: 'Back to People',
      saveButton: 'Save Person',
      updateButton: 'Update Person',
      deleteButton: 'Delete Person',
      deleteConfirmation: 'Are you sure you want to delete this person? This action cannot be undone.',
      photoGallery: 'Photo Gallery',
      addPhoto: 'Add Photo',
      addPhotoToGallery: 'Add Photo to Gallery',
      addPhotoToAlbum: 'Add Photo to Album',
      noPhotos: 'No photos in this album',
      createNewAlbum: 'Create New Album',
      albumName: 'Album Name',
      enterAlbumName: 'Enter album name',
      createAlbum: 'Create Album',
      photoDescription: 'Photo Description',
      enterPhotoDescription: 'Enter photo description',
      relationship: 'Relationship',
      relatedPeople: 'Related People',
      addRelationship: 'Add Relationship',
      relationshipType: 'Relationship Type',
      selectPerson: 'Select a person',
      selectRelationshipType: 'Select a relationship type',
      removeRelationshipConfirmation: 'Are you sure you want to remove this relationship?',
      tagPerson: "Tag Person",
      tagPersonInPhoto: "Tag Person in Photo",
      selectPersonToTag: "Select a person to tag in this photo",
      deleteAlbum: "Delete Album",
      deleteAlbumConfirmation: "Are you sure you want to delete this album? All photos in this album will be removed from the album but will remain in the main photo collection.",
      cancel: "Cancel",
      confirmDelete: "Delete",
    },
    settings: {
      title: 'Settings',
      tagline: 'Manage your app preferences',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      language: 'Language',
      dataManagement: 'Data Management',
      exportData: 'Export Data',
      exportDescription: 'Download all your data as a JSON file.',
      clearData: 'Clear All Data',
      clearDataDescription: 'Permanently delete all data from the app.',
      clearAll: 'Clear All',
      confirmation: 'Confirmation',
      confirmationDescription: 'Are you sure you want to clear all data? This action cannot be undone.',
      cancel: 'Cancel',
      confirmDelete: 'Delete All',
      fieldRequirements: 'Field Requirements',
      fieldRequirementsDescription: 'Choose which fields are required when adding a new person.',
      resetToDefaults: 'Reset to Defaults',
      relationshipTypes: 'Relationship Types',
      relationshipTypesDescription: 'Manage the types of relationships you can assign to people.',
      newRelationshipType: 'New Relationship Type',
      add: 'Add',
      relationshipTypeExists: 'This relationship type already exists.',
      relationshipTypeAdded: 'Relationship type added successfully.',
      relationshipTypeRemoved: 'Relationship type removed successfully.',
      defaultPhotoAlbums: "Default Photo Albums",
      defaultPhotoAlbumsDescription: "These albums are automatically created for each person. You can add new default albums that will be available for all people.",
      addDefaultAlbum: "Add Default Album",
      addNewDefaultAlbum: "Add New Default Album",
      albumName: "Album Name",
      enterAlbumName: "Enter album name",
      createAlbum: "Create Album",
    },
    toast: {
      success: 'Success',
      error: 'Error',
      exportSuccess: 'Data exported successfully!',
      exportFailed: 'Failed to export data.',
      clearSuccess: 'Data cleared successfully!',
      clearFailed: 'Failed to clear data.',
    },
  },
  pl: {
    nav: {
      people: 'Osoby',
      settings: 'Ustawienia',
    },
    common: {
      yes: 'Tak',
      no: 'Nie',
    },
    fields: {
      firstName: 'Imię',
      lastName: 'Nazwisko',
      nickname: 'Pseudonim',
      email: 'Email',
      phone: 'Telefon',
      address: 'Adres',
      birthDate: 'Data urodzenia',
      notes: 'Notatki',
      photo: 'Zdjęcie',
      basicInfo: 'Podstawowe informacje',
      additionalInfo: 'Dodatkowe informacje',
    },
    customFields: {
      noFields: 'Brak niestandardowych pól.',
      name: 'Nazwa',
      type: 'Typ',
      options: 'Opcje (rozdzielone przecinkami)',
      isRequired: 'Wymagane',
      add: 'Dodaj pole niestandardowe',
      edit: 'Edytuj pole niestandardowe',
      deleteConfirmation: 'Czy na pewno chcesz usunąć to pole? Spowoduje to usunięcie pola i wszystkich powiązanych danych z każdej osoby.',
    },
    person: {
      add: 'Dodaj osobę',
      edit: 'Edytuj osobę',
      view: 'Wyświetl osobę',
      addTagline: 'Dodaj nową osobę do swojego katalogu',
      editTagline: 'Edytuj istniejącą osobę w swoim katalogu',
      profileInformation: 'Informacje o profilu',
      notFound: 'Osoba nie znaleziona',
      notFoundMessage: 'Szukana osoba nie istnieje.',
      backButton: 'Powrót do osób',
      saveButton: 'Zapisz osobę',
      updateButton: 'Aktualizuj osobę',
      deleteButton: 'Usuń osobę',
      deleteConfirmation: 'Czy na pewno chcesz usunąć tę osobę? Tej akcji nie można cofnąć.',
      photoGallery: 'Galeria zdjęć',
      addPhoto: 'Dodaj zdjęcie',
      addPhotoToGallery: 'Dodaj zdjęcie do galerii',
      addPhotoToAlbum: 'Dodaj zdjęcie do albumu',
      noPhotos: 'Brak zdjęć w tym albumie',
      createNewAlbum: 'Utwórz nowy album',
      albumName: 'Nazwa albumu',
      enterAlbumName: 'Wprowadź nazwę albumu',
      createAlbum: 'Utwórz album',
      photoDescription: 'Opis zdjęcia',
      enterPhotoDescription: 'Wprowadź opis zdjęcia',
      relationship: 'Relacja',
      relatedPeople: 'Powiązane osoby',
      addRelationship: 'Dodaj relację',
      relationshipType: 'Typ relacji',
      selectPerson: 'Wybierz osobę',
      selectRelationshipType: 'Wybierz typ relacji',
      removeRelationshipConfirmation: 'Czy na pewno chcesz usunąć tę relację?',
      tagPerson: "Oznacz osobę",
      tagPersonInPhoto: "Oznacz osobę na zdjęciu",
      selectPersonToTag: "Wybierz osobę, którą chcesz oznaczyć na tym zdjęciu",
      deleteAlbum: "Usuń album",
      deleteAlbumConfirmation: "Czy na pewno chcesz usunąć ten album? Wszystkie zdjęcia z tego albumu zostaną usunięte z albumu, ale pozostaną w głównej kolekcji zdjęć.",
      cancel: "Anuluj",
      confirmDelete: "Usuń",
    },
    settings: {
      title: 'Ustawienia',
      tagline: 'Zarządzaj preferencjami aplikacji',
      appearance: 'Wygląd',
      darkMode: 'Tryb ciemny',
      language: 'Język',
      dataManagement: 'Zarządzanie danymi',
      exportData: 'Eksportuj dane',
      exportDescription: 'Pobierz wszystkie dane jako plik JSON.',
      clearData: 'Wyczyść wszystkie dane',
      clearDataDescription: 'Trwale usuń wszystkie dane z aplikacji.',
      clearAll: 'Wyczyść wszystko',
      confirmation: 'Potwierdzenie',
      confirmationDescription: 'Czy na pewno chcesz wyczyścić wszystkie dane? Tej akcji nie można cofnąć.',
      cancel: 'Anuluj',
      confirmDelete: 'Usuń wszystko',
      fieldRequirements: 'Wymagania dotyczące pól',
      fieldRequirementsDescription: 'Wybierz, które pola są wymagane podczas dodawania nowej osoby.',
      resetToDefaults: 'Przywróć ustawienia domyślne',
      relationshipTypes: 'Typy relacji',
      relationshipTypesDescription: 'Zarządzaj typami relacji, które możesz przypisać osobom.',
      newRelationshipType: 'Nowy typ relacji',
      add: 'Dodaj',
      relationshipTypeExists: 'Ten typ relacji już istnieje.',
      relationshipTypeAdded: 'Typ relacji został pomyślnie dodany.',
      relationshipTypeRemoved: 'Typ relacji został pomyślnie usunięty.',
      defaultPhotoAlbums: "Domyślne albumy zdjęć",
      defaultPhotoAlbumsDescription: "Te albumy są automatycznie tworzone dla każdej osoby. Możesz dodać nowe domyślne albumy, które będą dostępne dla wszystkich osób.",
      addDefaultAlbum: "Dodaj domyślny album",
      addNewDefaultAlbum: "Dodaj nowy domyślny album",
      albumName: "Nazwa albumu",
      enterAlbumName: "Wprowadź nazwę albumu",
      createAlbum: "Utwórz album",
    },
    toast: {
      success: 'Sukces',
      error: 'Błąd',
      exportSuccess: 'Dane zostały pomyślnie wyeksportowane!',
      exportFailed: 'Nie udało się wyeksportować danych.',
      clearSuccess: 'Dane zostały pomyślnie wyczyszczone!',
      clearFailed: 'Nie udało się wyczyścić danych.',
    },
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') as 'en' | 'pl' | null;
  const defaultLanguage = (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'pl')) ? storedLanguage : 'en';
  const [language, setLanguage] = React.useState<LanguageContextType['language']>(defaultLanguage);

  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, args?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string') {
      if (args) {
        Object.entries(args).forEach(([argKey, argValue]) => {
          const placeholder = new RegExp(`\\{\\{\\s*${argKey}\\s*\\}\\}`, 'g');
          value = value.replace(placeholder, String(argValue));
        });
      }
      return value;
    }

    return key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage: (lang: 'en' | 'pl') => setLanguage(lang),
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
