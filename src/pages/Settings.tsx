
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFieldRequirements } from '@/context/FieldRequirementsContext';
import { usePeople, defaultPhotoAlbums } from '@/context/PeopleContext';
import CustomFieldForm from '@/components/settings/CustomFieldForm';
import CustomFieldsList from '@/components/settings/CustomFieldsList';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon, Trash2, Download, Globe, Users, Plus, X, GalleryHorizontal, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { fieldRequirements, updateFieldRequirement, resetFieldRequirements } = useFieldRequirements();
  const { people, customFields, addCustomField, deleteCustomField, addDefaultAlbum, getDefaultAlbums } = usePeople();
  const { toast } = useToast();
  const [customRelationshipType, setCustomRelationshipType] = useState('');
  const [newDefaultAlbumName, setNewDefaultAlbumName] = useState('');
  const [isNewDefaultAlbumOpen, setIsNewDefaultAlbumOpen] = useState(false);
  const [relationshipTypes, setRelationshipTypes] = useState<string[]>(() => {
    const savedTypes = localStorage.getItem('relationshipTypes');
    return savedTypes ? JSON.parse(savedTypes) : [
      'Family',
      'Friend',
      'Colleague',
      'Classmate',
      'Neighbor',
      'Business'
    ];
  });

  const handleExportData = () => {
    try {
      const data = { 
        people, 
        customFields,
        fieldRequirements,
        language,
        theme 
      };
      const jsonString = JSON.stringify(data, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.download = `personify-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.href = window.URL.createObjectURL(blob);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('toast.success'),
        description: t('toast.exportSuccess'),
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.exportFailed'),
        variant: "destructive",
      });
    }
  };

  const handleClearAllData = () => {
    try {
      localStorage.removeItem('people');
      
      window.location.reload();
      
      toast({
        title: t('toast.success'),
        description: t('toast.clearSuccess'),
      });
    } catch (error) {
      console.error('Clear data error:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.clearFailed'),
        variant: "destructive",
      });
    }
  };

  const handleAddRelationshipType = () => {
    if (!customRelationshipType.trim()) return;
    
    const newType = customRelationshipType.trim();
    if (relationshipTypes.includes(newType)) {
      toast({
        title: t('toast.error'),
        description: t('settings.relationshipTypeExists'),
        variant: "destructive",
      });
      return;
    }
    
    const updatedTypes = [...relationshipTypes, newType];
    setRelationshipTypes(updatedTypes);
    localStorage.setItem('relationshipTypes', JSON.stringify(updatedTypes));
    setCustomRelationshipType('');
    
    toast({
      title: t('toast.success'),
      description: t('settings.relationshipTypeAdded'),
    });
  };

  const handleRemoveRelationshipType = (type: string) => {
    const updatedTypes = relationshipTypes.filter(t => t !== type);
    setRelationshipTypes(updatedTypes);
    localStorage.setItem('relationshipTypes', JSON.stringify(updatedTypes));
    
    toast({
      title: t('toast.success'),
      description: t('settings.relationshipTypeRemoved'),
    });
  };

  const handleAddDefaultAlbum = () => {
    if (!newDefaultAlbumName.trim()) return;
    
    addDefaultAlbum(newDefaultAlbumName.trim());
    setNewDefaultAlbumName('');
    setIsNewDefaultAlbumOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearance')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === 'light' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                  <Label htmlFor="theme-mode">{t('settings.darkMode')}</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <Label htmlFor="language">{t('settings.language')}</Label>
                </div>
                <Select
                  value={language}
                  onValueChange={(value: 'en' | 'pl') => setLanguage(value)}
                >
                  <SelectTrigger id="language" className="w-40">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pl">Polski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.dataManagement')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{t('settings.exportData')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.exportDescription')}
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  {t('settings.export')}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-destructive">{t('settings.clearData')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.clearDataDescription')}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('settings.clearAll')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.confirmation')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('settings.confirmationDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData}>
                        {t('settings.confirmDelete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.fieldRequirements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('settings.fieldRequirementsDescription')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="email-required" className="font-medium">
                  {t('fields.email')}
                </Label>
                <Switch
                  id="email-required"
                  checked={fieldRequirements.email}
                  onCheckedChange={(checked) => updateFieldRequirement('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="lastName-required" className="font-medium">
                  {t('fields.lastName')}
                </Label>
                <Switch
                  id="lastName-required"
                  checked={fieldRequirements.lastName}
                  onCheckedChange={(checked) => updateFieldRequirement('lastName', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="nickname-required" className="font-medium">
                  {t('fields.nickname')}
                </Label>
                <Switch
                  id="nickname-required"
                  checked={fieldRequirements.nickname}
                  onCheckedChange={(checked) => updateFieldRequirement('nickname', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="phone-required" className="font-medium">
                  {t('fields.phone')}
                </Label>
                <Switch
                  id="phone-required"
                  checked={fieldRequirements.phone}
                  onCheckedChange={(checked) => updateFieldRequirement('phone', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="address-required" className="font-medium">
                  {t('fields.address')}
                </Label>
                <Switch
                  id="address-required"
                  checked={fieldRequirements.address}
                  onCheckedChange={(checked) => updateFieldRequirement('address', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="birthDate-required" className="font-medium">
                  {t('fields.birthDate')}
                </Label>
                <Switch
                  id="birthDate-required"
                  checked={fieldRequirements.birthDate}
                  onCheckedChange={(checked) => updateFieldRequirement('birthDate', checked)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={resetFieldRequirements}>
                {t('settings.resetToDefaults')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Default Photo Albums and Relationship Types combined in a grid side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GalleryHorizontal className="h-5 w-5" />
                {t('settings.defaultPhotoAlbums')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t('settings.defaultPhotoAlbumsDescription')}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {getDefaultAlbums().map(album => (
                  <Badge key={album.id} variant="outline" className="flex items-center gap-1 px-3 py-1.5">
                    {album.name}
                  </Badge>
                ))}
              </div>
              
              <Dialog open={isNewDefaultAlbumOpen} onOpenChange={setIsNewDefaultAlbumOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('settings.addDefaultAlbum')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('settings.addNewDefaultAlbum')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="default-album-name" className="text-sm font-medium">
                        {t('settings.albumName')}
                      </label>
                      <Input
                        id="default-album-name"
                        value={newDefaultAlbumName}
                        onChange={(e) => setNewDefaultAlbumName(e.target.value)}
                        placeholder={t('settings.enterAlbumName')}
                      />
                    </div>
                    <Button 
                      onClick={handleAddDefaultAlbum}
                      disabled={!newDefaultAlbumName.trim()}
                      className="w-full"
                    >
                      {t('settings.createAlbum')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('settings.relationshipTypes')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t('settings.relationshipTypesDescription')}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {relationshipTypes.map(type => (
                  <Badge key={type} variant="outline" className="flex items-center gap-1 px-3 py-1.5">
                    {type}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full ml-1"
                      onClick={() => handleRemoveRelationshipType(type)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder={t('settings.newRelationshipType')}
                  value={customRelationshipType}
                  onChange={(e) => setCustomRelationshipType(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddRelationshipType}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('settings.add')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CustomFieldForm onAddField={addCustomField} />
            </div>
            <div className="md:col-span-2">
              <CustomFieldsList 
                fields={customFields} 
                onDelete={deleteCustomField}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
