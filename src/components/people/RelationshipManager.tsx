
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Person, usePeople } from "@/context/PeopleContext";
import { Badge } from "@/components/ui/badge";
import { Link as RouterLink } from "react-router-dom";
import { Link, LinkIcon, Trash2, User } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

interface RelationshipManagerProps {
  person: Person;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ person }) => {
  const { people, addRelationship, removeRelationship } = usePeople();
  const { t } = useLanguage();
  const [relatedPersonId, setRelatedPersonId] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [customType, setCustomType] = useState('');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  
  useEffect(() => {
    // Load relationship types from localStorage or use defaults
    const savedTypes = localStorage.getItem('relationshipTypes');
    const types = savedTypes ? JSON.parse(savedTypes) : [
      'Family',
      'Friend',
      'Colleague',
      'Classmate',
      'Neighbor',
      'Business'
    ];
    setAvailableTypes(types);
  }, []);

  const availablePeople = people.filter(
    p => p.id !== person.id && !person.relationships.some(r => r.relatedPersonId === p.id)
  );

  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? `${person.firstName} ${person.lastName}` : t('relationships.unknownPerson');
  };

  const getRelatedPerson = (id: string) => {
    return people.find(p => p.id === id);
  };

  const handleAddRelationship = () => {
    if (!relatedPersonId) return;
    
    const type = relationshipType === 'custom' ? customType : relationshipType;
    if (!type) return;
    
    addRelationship(person.id, relatedPersonId, type);
    setRelatedPersonId('');
    setRelationshipType('');
    setCustomType('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          {t('relationships.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={relatedPersonId} onValueChange={setRelatedPersonId}>
              <SelectTrigger>
                <SelectValue placeholder={t('relationships.selectPerson')} />
              </SelectTrigger>
              <SelectContent>
                {availablePeople.length === 0 ? (
                  <SelectItem value="none" disabled>
                    {t('relationships.noAvailablePeople')}
                  </SelectItem>
                ) : (
                  availablePeople.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger>
                <SelectValue placeholder={t('relationships.relationshipType')} />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
                <SelectItem value="custom">{t('relationships.custom')}</SelectItem>
              </SelectContent>
            </Select>

            {relationshipType === 'custom' ? (
              <Input
                placeholder={t('relationships.customRelationshipType')}
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            ) : (
              <Button 
                onClick={handleAddRelationship}
                disabled={!relatedPersonId || !relationshipType}
              >
                {t('relationships.addRelationship')}
              </Button>
            )}

            {relationshipType === 'custom' && (
              <Button 
                className="md:col-start-3"
                onClick={handleAddRelationship}
                disabled={!relatedPersonId || !customType}
              >
                {t('relationships.addCustomRelationship')}
              </Button>
            )}
          </div>
        </div>

        {person.relationships.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('relationships.person')}</TableHead>
                <TableHead>{t('relationships.relationship')}</TableHead>
                <TableHead className="text-right">{t('relationships.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {person.relationships.map((relationship) => {
                const relatedPerson = getRelatedPerson(relationship.relatedPersonId);
                return (
                  <TableRow key={relationship.relatedPersonId}>
                    <TableCell>
                      <Button variant="link" asChild className="p-0 flex items-center gap-2">
                        <RouterLink to={`/people/${relationship.relatedPersonId}`}>
                          <div className="flex items-center gap-2">
                            {relatedPerson?.photo ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                  src={relatedPerson.photo} 
                                  alt={getPersonName(relationship.relatedPersonId)}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                            <span>{getPersonName(relationship.relatedPersonId)}</span>
                          </div>
                        </RouterLink>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{relationship.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRelationship(person.id, relationship.relatedPersonId)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {t('relationships.noRelationships')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelationshipManager;
