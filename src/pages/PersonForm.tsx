import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeople, Person, PhotoAlbum } from '@/context/PeopleContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFieldRequirements } from '@/context/FieldRequirementsContext';
import CustomFieldInput from '@/components/people/CustomFieldInput';
import ImageUpload from '@/components/people/ImageUpload';
import { SaveIcon, ArrowLeft } from 'lucide-react';

const defaultPhotoAlbums: PhotoAlbum[] = [
  { id: "album-me", name: "Me", photos: [] },
  { id: "album-general", name: "General", photos: [] },
  { id: "album-friends", name: "Friends", photos: [] },
];

const PersonForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPerson, addPerson, updatePerson, customFields } = usePeople();
  const { t } = useLanguage();
  const { fieldRequirements } = useFieldRequirements();
  
  const isEditMode = !!id;
  const existingPerson = isEditMode ? getPerson(id) : undefined;
  
  const [formData, setFormData] = useState<Omit<Person, 'id' | 'createdAt' | 'updatedAt'>>({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    photo: undefined,
    photoDetails: [],
    photoAlbums: JSON.parse(JSON.stringify(defaultPhotoAlbums)),
    notes: '',
    customFields: {},
    relationships: []
  });

  useEffect(() => {
    if (isEditMode && existingPerson) {
      setFormData({
        firstName: existingPerson.firstName,
        lastName: existingPerson.lastName,
        nickname: existingPerson.nickname || '',
        email: existingPerson.email,
        phone: existingPerson.phone || '',
        address: existingPerson.address || '',
        birthDate: existingPerson.birthDate || '',
        photo: existingPerson.photo,
        photoDetails: existingPerson.photoDetails || [],
        photoAlbums: existingPerson.photoAlbums || JSON.parse(JSON.stringify(defaultPhotoAlbums)),
        notes: existingPerson.notes || '',
        customFields: existingPerson.customFields,
        relationships: existingPerson.relationships
      });
    }
  }, [isEditMode, existingPerson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value
      }
    }));
  };

  const handleImageChange = (imageBase64: string | undefined) => {
    setFormData(prev => {
      if (imageBase64) {
        const updatedAlbums = prev.photoAlbums.map(album => {
          if (album.id === 'album-me') {
            if (album.photos.length === 0) {
              return {
                ...album,
                photos: [{ url: imageBase64, description: '' }]
              };
            }
          }
          return album;
        });
        
        return {
          ...prev,
          photo: imageBase64,
          photoAlbums: updatedAlbums
        };
      } else {
        return {
          ...prev,
          photo: undefined
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && id) {
      updatePerson(id, formData);
      navigate(`/people/${id}`);
    } else {
      const newId = addPerson(formData);
      navigate(`/people/${newId}`);
    }
  };

  if (isEditMode && !existingPerson) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold mb-4">{t('person.notFound')}</h2>
          <p className="mb-4">{t('person.notFoundMessage')}</p>
          <Button onClick={() => navigate('/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('person.backButton')}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? t('person.edit') : t('person.add')}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? t('person.editTagline') : t('person.addTagline')}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('person.backButton')}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('fields.photo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload 
                  initialImage={formData.photo} 
                  onImageChange={handleImageChange} 
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('fields.basicInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('fields.firstName')} <span className="text-destructive">*</span></Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {t('fields.lastName')}
                      {fieldRequirements.lastName && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={fieldRequirements.lastName}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">
                    {t('fields.nickname')}
                    {fieldRequirements.nickname && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required={fieldRequirements.nickname}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('fields.email')} 
                    {fieldRequirements.email && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={fieldRequirements.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('fields.phone')}
                    {fieldRequirements.phone && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required={fieldRequirements.phone}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    {t('fields.address')}
                    {fieldRequirements.address && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required={fieldRequirements.address}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    {t('fields.birthDate')}
                    {fieldRequirements.birthDate && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required={fieldRequirements.birthDate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('fields.notes')}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {customFields.length > 0 && (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{t('fields.additionalInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customFields.map((field) => (
                      <CustomFieldInput
                        key={field.id}
                        field={field}
                        value={formData.customFields[field.id]}
                        onChange={(value) => handleCustomFieldChange(field.id, value)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="md:col-span-3">
              <Button type="submit" className="w-full">
                <SaveIcon className="mr-2 h-4 w-4" />
                {isEditMode ? t('person.updateButton') : t('person.saveButton')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PersonForm;
