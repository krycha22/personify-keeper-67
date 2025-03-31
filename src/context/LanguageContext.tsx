
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'pl';

interface Translations {
  [key: string]: {
    en: string;
    pl: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  // Common
  'app.name': {
    en: 'PersonifyKeeper',
    pl: 'PersonifyKeeper',
  },
  'app.tagline': {
    en: 'Manage your contacts with ease',
    pl: 'Zarządzaj kontaktami z łatwością',
  },

  // Navigation
  'nav.home': {
    en: 'Home',
    pl: 'Strona główna',
  },
  'nav.people': {
    en: 'People',
    pl: 'Osoby',
  },
  'nav.settings': {
    en: 'Settings',
    pl: 'Ustawienia',
  },

  // People
  'people.title': {
    en: 'People',
    pl: 'Osoby',
  },
  'people.add': {
    en: 'Add Person',
    pl: 'Dodaj osobę',
  },
  'people.search': {
    en: 'Search people...',
    pl: 'Szukaj osób...',
  },
  'people.notFound': {
    en: 'No people found',
    pl: 'Nie znaleziono osób',
  },

  // Person form
  'person.add': {
    en: 'Add New Person',
    pl: 'Dodaj nową osobę',
  },
  'person.edit': {
    en: 'Edit Person',
    pl: 'Edytuj osobę',
  },
  'person.addTagline': {
    en: 'Create a profile for a new person',
    pl: 'Utwórz profil dla nowej osoby',
  },
  'person.editTagline': {
    en: 'Update the information for this person',
    pl: 'Zaktualizuj informacje o tej osobie',
  },
  'person.backButton': {
    en: 'Back',
    pl: 'Wróć',
  },
  'person.saveButton': {
    en: 'Save Person',
    pl: 'Zapisz osobę',
  },
  'person.updateButton': {
    en: 'Update Person',
    pl: 'Aktualizuj osobę',
  },
  'person.notFound': {
    en: 'Person Not Found',
    pl: 'Nie znaleziono osoby',
  },
  'person.notFoundMessage': {
    en: "The person you're trying to edit doesn't exist.",
    pl: 'Osoba, którą próbujesz edytować, nie istnieje.',
  },
  'person.photoGallery': {
    en: 'Photo Gallery',
    pl: 'Galeria zdjęć',
  },
  'person.noPhotos': {
    en: 'No photos in the gallery yet',
    pl: 'Brak zdjęć w galerii',
  },
  'person.addPhoto': {
    en: 'Add Photo',
    pl: 'Dodaj zdjęcie',
  },
  'person.addPhotoToGallery': {
    en: 'Add Photo to Gallery',
    pl: 'Dodaj zdjęcie do galerii',
  },
  'person.addPhotoToAlbum': {
    en: 'Add Photo to Album',
    pl: 'Dodaj zdjęcie do albumu',
  },
  'person.newAlbum': {
    en: 'New Album',
    pl: 'Nowy Album',
  },
  'person.createNewAlbum': {
    en: 'Create New Album',
    pl: 'Utwórz nowy album',
  },
  'person.albumName': {
    en: 'Album Name',
    pl: 'Nazwa albumu',
  },
  'person.enterAlbumName': {
    en: 'Enter album name',
    pl: 'Wprowadź nazwę albumu',
  },
  'person.createAlbum': {
    en: 'Create Album',
    pl: 'Utwórz album',
  },
  'person.renameAlbum': {
    en: 'Rename Album',
    pl: 'Zmień nazwę albumu',
  },
  'person.newAlbumName': {
    en: 'New Album Name',
    pl: 'Nowa nazwa albumu',
  },
  'person.enterNewAlbumName': {
    en: 'Enter new album name',
    pl: 'Wprowadź nową nazwę albumu',
  },
  'person.saveAlbumName': {
    en: 'Save Album Name',
    pl: 'Zapisz nazwę albumu',
  },
  'person.delete': {
    en: 'Delete',
    pl: 'Usuń',
  },
  'person.cancel': {
    en: 'Cancel',
    pl: 'Anuluj',
  },
  'person.confirmDelete': {
    en: 'Yes, delete',
    pl: 'Tak, usuń',
  },
  'person.areYouSure': {
    en: 'Are you sure?',
    pl: 'Czy jesteś pewien?',
  },
  'person.deleteConfirmation': {
    en: 'This will permanently delete {name} from your contacts.',
    pl: 'To spowoduje trwałe usunięcie {name} z listy kontaktów.',
  },

  // Person fields
  'fields.photo': {
    en: 'Photo',
    pl: 'Zdjęcie',
  },
  'fields.basicInfo': {
    en: 'Basic Information',
    pl: 'Podstawowe informacje',
  },
  'fields.firstName': {
    en: 'First Name',
    pl: 'Imię',
  },
  'fields.lastName': {
    en: 'Last Name',
    pl: 'Nazwisko',
  },
  'fields.nickname': {
    en: 'Nickname',
    pl: 'Ksywa',
  },
  'fields.email': {
    en: 'Email',
    pl: 'Email',
  },
  'fields.phone': {
    en: 'Phone Number',
    pl: 'Numer telefonu',
  },
  'fields.address': {
    en: 'Address',
    pl: 'Adres',
  },
  'fields.birthDate': {
    en: 'Birth Date',
    pl: 'Data urodzenia',
  },
  'fields.notes': {
    en: 'Notes',
    pl: 'Notatki',
  },
  'fields.additionalInfo': {
    en: 'Additional Information',
    pl: 'Dodatkowe informacje',
  },
  'fields.required': {
    en: 'Required',
    pl: 'Wymagane',
  },
  'fields.optional': {
    en: 'Optional',
    pl: 'Opcjonalne',
  },
  
  // Photo descriptions
  'person.photoDescription': {
    en: 'Photo Description',
    pl: 'Opis zdjęcia',
  },
  'person.enterPhotoDescription': {
    en: 'Enter a description for this photo',
    pl: 'Wpisz opis tego zdjęcia',
  },

  // Settings
  'settings.title': {
    en: 'Settings',
    pl: 'Ustawienia',
  },
  'settings.tagline': {
    en: 'Customize your PersonifyKeeper experience',
    pl: 'Dostosuj swoje doświadczenie PersonifyKeeper',
  },
  'settings.appearance': {
    en: 'Appearance',
    pl: 'Wygląd',
  },
  'settings.darkMode': {
    en: 'Dark Mode',
    pl: 'Tryb ciemny',
  },
  'settings.language': {
    en: 'Language',
    pl: 'Język',
  },
  'settings.dataManagement': {
    en: 'Data Management',
    pl: 'Zarządzanie danymi',
  },
  'settings.exportData': {
    en: 'Export Data',
    pl: 'Eksportuj dane',
  },
  'settings.exportDescription': {
    en: 'Download all your people data and settings as a JSON file',
    pl: 'Pobierz wszystkie dane o osobach i ustawienia jako plik JSON',
  },
  'settings.clearData': {
    en: 'Clear All Data',
    pl: 'Wyczyść wszystkie dane',
  },
  'settings.clearDataDescription': {
    en: 'Permanently delete all people profiles and data',
    pl: 'Trwale usuń wszystkie profile osób i dane',
  },
  'settings.export': {
    en: 'Export',
    pl: 'Eksportuj',
  },
  'settings.clearAll': {
    en: 'Clear All',
    pl: 'Wyczyść wszystko',
  },
  'settings.confirmation': {
    en: 'Are you absolutely sure?',
    pl: 'Czy jesteś absolutnie pewien?',
  },
  'settings.confirmationDescription': {
    en: 'This action cannot be undone. This will permanently delete all person profiles and custom fields from your local storage.',
    pl: 'Tej akcji nie można cofnąć. Spowoduje to trwałe usunięcie wszystkich profili osób i niestandardowych pól z lokalnego magazynu.',
  },
  'settings.cancel': {
    en: 'Cancel',
    pl: 'Anuluj',
  },
  'settings.confirmDelete': {
    en: 'Yes, delete everything',
    pl: 'Tak, usuń wszystko',
  },
  'settings.fieldRequirements': {
    en: 'Field Requirements',
    pl: 'Wymagania pól',
  },
  'settings.fieldRequirementsDescription': {
    en: 'Choose which fields are required when creating or editing a person',
    pl: 'Wybierz, które pola są wymagane podczas tworzenia lub edytowania osoby',
  },
  'settings.add': {
    en: 'Add',
    pl: 'Dodaj',
  },
  'settings.relationshipTypes': {
    en: 'Relationship Types',
    pl: 'Typ relacji',
  },
  'settings.relationshipTypesDescription': {
    en: 'Relationship Types',
    pl: 'Typ relacji',
  },
  'settings.resetToDefaults': {
    en: 'Reset to default',
    pl: 'Rest ustawień',
  },
  
  // Custom fields
  'customFields.title': {
    en: 'Custom Fields',
    pl: 'Niestandardowe pola',
  },
  'customFields.add': {
    en: 'Add Custom Field',
    pl: 'Dodaj niestandardowe pole',
  },
  'customFields.name': {
    en: 'Field Name',
    pl: 'Nazwa pola',
  },
  'customFields.type': {
    en: 'Field Type',
    pl: 'Typ pola',
  },
  'customFields.required': {
    en: 'Required Field',
    pl: 'Pole wymagane',
  },
  'customFields.options': {
    en: 'Options',
    pl: 'Opcje',
  },
  'customFields.addOption': {
    en: 'Add an option',
    pl: 'Dodaj opcję',
  },
  'customFields.addButton': {
    en: 'Add',
    pl: 'Dodaj',
  },
  'customFields.addFieldButton': {
    en: 'Add Field',
    pl: 'Dodaj pole',
  },
  'customFields.optionsMessage': {
    en: 'Add at least one option for the dropdown.',
    pl: 'Dodaj co najmniej jedną opcję dla rozwijanej listy.',
  },
  'customFields.noFields': {
    en: 'No custom fields created yet.',
    pl: 'Nie utworzono jeszcze niestandardowych pól.',
  },
  'customFields.actions': {
    en: 'Actions',
    pl: 'Akcje',
  },
  'customFields.deleteConfirmation': {
    en: 'Are you sure?',
    pl: 'Czy jesteś pewien?',
  },
  'customFields.deleteConfirmationDescription': {
    en: 'This will delete the "{field}" field from all person profiles. This action cannot be undone.',
    pl: 'Spowoduje to usunięcie pola "{field}" ze wszystkich profili osób. Tej akcji nie można cofnąć.',
  },

  // Toast messages
  'toast.success': {
    en: 'Success',
    pl: 'Sukces',
  },
  'toast.error': {
    en: 'Error',
    pl: 'Błąd',
  },
  'toast.exportSuccess': {
    en: 'Data exported successfully',
    pl: 'Dane wyeksportowane pomyślnie',
  },
  'toast.exportFailed': {
    en: 'There was an error exporting your data',
    pl: 'Wystąpił błąd podczas eksportowania danych',
  },
  'toast.clearSuccess': {
    en: 'All data has been cleared',
    pl: 'Wszystkie dane zostały wyczyszczone',
  },
  'toast.clearFailed': {
    en: 'Failed to clear data',
    pl: 'Nie udało się wyczyścić danych',
  },

  // Relationships
  'relationships.title': {
    en: 'Relationships',
    pl: 'Relacje',
  },
  'relationships.selectPerson': {
    en: 'Select person',
    pl: 'Wybierz osobę',
  },
  'relationships.noAvailablePeople': {
    en: 'No available people',
    pl: 'Brak dostępnych osób',
  },
  'relationships.relationshipType': {
    en: 'Relationship type',
    pl: 'Typ relacji',
  },
  'relationships.customRelationshipType': {
    en: 'Custom relationship type',
    pl: 'Niestandardowy typ relacji',
  },
  'relationships.addRelationship': {
    en: 'Add Relationship',
    pl: 'Dodaj relację',
  },
  'relationships.addCustomRelationship': {
    en: 'Add Custom Relationship',
    pl: 'Dodaj niestandardową relację',
  },
  'relationships.person': {
    en: 'Person',
    pl: 'Osoba',
  },
  'relationships.relationship': {
    en: 'Relationship',
    pl: 'Relacja',
  },
  'relationships.actions': {
    en: 'Actions',
    pl: 'Akcje',
  },
  'relationships.noRelationships': {
    en: 'No relationships have been added yet.',
    pl: 'Nie dodano jeszcze żadnych relacji.',
  },
  'relationships.unknownPerson': {
    en: 'Unknown Person',
    pl: 'Nieznana osoba',
  },
  'relationships.family': {
    en: 'Family',
    pl: 'Rodzina',
  },
  'relationships.friend': {
    en: 'Friend',
    pl: 'Przyjaciel',
  },
  'relationships.colleague': {
    en: 'Colleague',
    pl: 'Współpracownik',
  },
  'relationships.classmate': {
    en: 'Classmate',
    pl: 'Kolega z klasy',
  },
  'relationships.neighbor': {
    en: 'Neighbor',
    pl: 'Sąsiad',
  },
  'relationships.business': {
    en: 'Business Contact',
    pl: 'Kontakt biznesowy',
  },
  'relationships.custom': {
    en: 'Custom',
    pl: 'Niestandardowy',
  },

  // Common additional translations
  'common.yes': {
    en: 'Yes',
    pl: 'Tak',
  },
  'common.no': {
    en: 'No',
    pl: 'Nie',
  },
  
  // Person profile
  'person.profileInformation': {
    en: 'Profile Information',
    pl: 'Informacje o profilu',
  },
  'person.noJobTitle': {
    en: 'No job title',
    pl: 'Brak stanowiska',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
