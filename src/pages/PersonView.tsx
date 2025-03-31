import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePeople } from '@/context/PeopleContext';
import { useLanguage } from '@/context/LanguageContext';
import RelationshipManager from '@/components/people/RelationshipManager';
import PhotoGallery from '@/components/people/PhotoGallery';
import { ArrowLeft, Edit, Mail, MapPin, Phone, Calendar, FileText, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PersonView = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { getPerson } = usePeople();
  const { t } = useLanguage();
  
  const person = id ? getPerson(id) : undefined;

  useEffect(() => {
    if (!person) {
      console.error('Person not found:', id);
    }
  }, [person, id]);

  useEffect(() => {
    if (person && person.isHidden && !isAdmin()) {
      navigate('/people');
    }
  }, [person, isAdmin, navigate]);

  if (!person) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold mb-4">{t('person.notFound')}</h2>
          <p className="mb-4">{t('person.notFoundMessage')}</p>
          <Button onClick={() => navigate('/people')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('nav.people')}
          </Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{person.firstName} {person.lastName}</h1>
            {person.nickname && (
              <p className="text-lg text-muted-foreground">"{person.nickname}"</p>
            )}
            <p className="text-muted-foreground">{t('person.profileInformation')}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('person.backButton')}
            </Button>
            <Button asChild>
              <Link to={`/people/${person.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                {t('person.edit')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Photo & basic info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border">
                  {person.photo ? (
                    <img 
                      src={person.photo} 
                      alt={`${person.firstName} ${person.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {person.firstName.charAt(0)}{person.lastName ? person.lastName.charAt(0) : ''}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold">{person.firstName} {person.lastName}</h2>
                {person.nickname && (
                  <p className="text-muted-foreground">"{person.nickname}"</p>
                )}
              </div>
              
              <div className="space-y-4">
                {person.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {t('fields.email')}
                      </p>
                      <p>{person.email}</p>
                    </div>
                  </div>
                )}
                
                {person.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {t('fields.phone')}
                      </p>
                      <p>{person.phone}</p>
                    </div>
                  </div>
                )}
                
                {person.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {t('fields.address')}
                      </p>
                      <p>{person.address}</p>
                    </div>
                  </div>
                )}
                
                {person.birthDate && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {t('fields.birthDate')}
                      </p>
                      <p>{formatDate(person.birthDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Middle column - Custom fields & notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('fields.additionalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(person.customFields).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(person.customFields).map(([fieldId, value]) => {
                    const field = usePeople().customFields.find(f => f.id === fieldId);
                    if (!field || value === undefined || value === '') return null;
                    
                    return (
                      <div key={fieldId} className="flex items-start">
                        <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">
                            {field.name}
                          </p>
                          <p>
                            {field.type === 'checkbox' 
                              ? (value ? t('common.yes') : t('common.no'))
                              : String(value)
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('customFields.noFields')}</p>
              )}
              
              {person.notes && (
                <div className="pt-4 border-t">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        {t('fields.notes')}
                      </p>
                      <p className="whitespace-pre-line">{person.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column - Relationships */}
          <Card>
            <RelationshipManager person={person} />
          </Card>
          
          {/* Photo Gallery - Spans all columns */}
          <Card className="md:col-span-3">
            <PhotoGallery person={person} />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PersonView;
