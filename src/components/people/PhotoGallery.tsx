import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/context/LanguageContext';
import { usePeople, Person, PhotoAlbum } from '@/context/PeopleContext';
import ImageUpload from '@/components/people/ImageUpload';
import { Images, Trash2, GalleryHorizontal, FolderPlus, Pencil, Link } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link as RouterLink } from 'react-router-dom';

interface PhotoGalleryProps {
  person: Person;
}

// Regex to match user references like @user-123
const USER_REFERENCE_REGEX = /@person-\d+/g;

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ person }) => {
  const { t } = useLanguage();
  const { getPerson, addPhotoToGallery, removePhotoFromGallery, updatePhotoDescription, addPhotoAlbum, removePhotoAlbum, renamePhotoAlbum, people } = usePeople();
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isNewAlbumOpen, setIsNewAlbumOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("album-general");
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [isRenameAlbumOpen, setIsRenameAlbumOpen] = useState(false);
  const [albumToRename, setAlbumToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  const [isUserReferenceDialogOpen, setIsUserReferenceDialogOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null);
  
  const handleImageChange = (imageBase64: string | undefined) => {
    if (imageBase64 && person.id) {
      addPhotoToGallery(person.id, imageBase64, '', selectedAlbumId);
      setIsAddPhotoOpen(false);
    }
  };
  
  const handleRemovePhoto = (index: number, albumId?: string) => {
    if (person.id) {
      removePhotoFromGallery(person.id, index, albumId);
      if (viewingPhotoIndex === index) {
        setViewingPhotoIndex(null);
      }
    }
  };

  const handleDescriptionChange = (index: number, description: string, albumId?: string) => {
    if (person.id) {
      updatePhotoDescription(person.id, index, description, albumId);
    }
  };
  
  const handleCreateAlbum = () => {
    if (newAlbumName.trim() && person.id) {
      const newAlbumId = addPhotoAlbum(person.id, newAlbumName.trim());
      setSelectedAlbumId(newAlbumId);
      setNewAlbumName('');
      setIsNewAlbumOpen(false);
    }
  };
  
  const handleRenameAlbum = () => {
    if (albumToRename && newName.trim() && person.id) {
      renamePhotoAlbum(person.id, albumToRename, newName.trim());
      setAlbumToRename(null);
      setNewName('');
      setIsRenameAlbumOpen(false);
    }
  };
  
  const handleOpenRenameAlbum = (albumId: string, currentName: string) => {
    setAlbumToRename(albumId);
    setNewName(currentName);
    setIsRenameAlbumOpen(true);
  };
  
  const handleOpenDeleteAlbum = (albumId: string) => {
    setAlbumToDelete(albumId);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleDeleteAlbum = () => {
    if (albumToDelete && person.id) {
      removePhotoAlbum(person.id, albumToDelete);
      
      // If the deleted album was selected, switch to General album
      if (selectedAlbumId === albumToDelete) {
        setSelectedAlbumId("album-general");
      }
      
      setAlbumToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };
  
  const getActiveAlbum = (): PhotoAlbum | undefined => {
    return person.photoAlbums?.find(album => album.id === selectedAlbumId);
  };
  
  const isDefaultAlbum = (albumId: string): boolean => {
    return ["album-me", "album-general", "album-friends"].includes(albumId);
  };
  
  const formatDescriptionWithUserLinks = (description: string) => {
    if (!description) return '';
    
    // Find user references and replace them with links
    const parts = description.split(USER_REFERENCE_REGEX);
    const matches = description.match(USER_REFERENCE_REGEX) || [];
    
    if (matches.length === 0) return description;
    
    return (
      <>
        {parts.map((part, i) => {
          // For the last part, there's no matching user reference
          if (i === parts.length - 1) return part;
          
          const userReference = matches[i];
          const userId = userReference.substring(1); // Remove the @ symbol
          const referencedPerson = getPerson(userId);
          
          return (
            <React.Fragment key={i}>
              {part}
              <RouterLink to={`/people/${userId}`} className="inline-flex items-center text-primary hover:underline">
                @{referencedPerson ? `${referencedPerson.firstName} ${referencedPerson.lastName}` : userId}
              </RouterLink>
            </React.Fragment>
          );
        })}
      </>
    );
  };
  
  const handleOpenUserReferenceDialog = (index: number, albumId?: string) => {
    setCurrentPhotoIndex(index);
    setCurrentAlbumId(albumId || null);
    setIsUserReferenceDialogOpen(true);
  };
  
  const handleAddUserReference = (userId: string) => {
    if (currentPhotoIndex !== null && person.id) {
      const albumId = currentAlbumId || undefined;
      const album = albumId ? person.photoAlbums.find(a => a.id === albumId) : undefined;
      const photo = album ? album.photos[currentPhotoIndex] : (person.photoDetails && person.photoDetails[currentPhotoIndex]);
      
      if (photo) {
        const currentDescription = photo.description || '';
        const newDescription = currentDescription ? `${currentDescription} @${userId}` : `@${userId}`;
        handleDescriptionChange(currentPhotoIndex, newDescription, albumId);
      }
      
      setIsUserReferenceDialogOpen(false);
    }
  };
  
  const activeAlbum = getActiveAlbum();
  const photos = activeAlbum?.photos || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GalleryHorizontal className="h-5 w-5" />
            {t('person.photoGallery')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNewAlbumOpen(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              {t('person.newAlbum')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs 
          defaultValue="album-general" 
          value={selectedAlbumId}
          onValueChange={setSelectedAlbumId}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {person.photoAlbums?.map((album) => (
              <div key={album.id} className="flex items-center">
                <TabsTrigger value={album.id} className="relative">
                  {album.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({album.photos.length})
                  </span>
                </TabsTrigger>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenRenameAlbum(album.id, album.name);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                {!isDefaultAlbum(album.id) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteAlbum(album.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </TabsList>
          
          {person.photoAlbums?.map((album) => (
            <TabsContent key={album.id} value={album.id} className="space-y-4">
              {album.photos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {album.photos.map((photoDetail, index) => (
                      <div key={index} className="relative group">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div 
                              className="cursor-pointer overflow-hidden rounded-md border h-32 bg-muted"
                              onClick={() => setViewingPhotoIndex(index)}
                            >
                              <img 
                                src={photoDetail.url} 
                                alt={photoDetail.description || `${person.firstName} ${person.lastName} - Photo ${index + 1}`}
                                className="h-full w-full object-cover transition-all hover:scale-105"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-6">
                            <div className="space-y-4">
                              <div className="relative">
                                <img 
                                  src={photoDetail.url} 
                                  alt={photoDetail.description || `${person.firstName} ${person.lastName} - Photo ${index + 1}`}
                                  className="max-h-[60vh] w-auto mx-auto rounded-lg"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <label htmlFor={`photo-description-${index}`} className="text-sm font-medium">
                                    {t('person.photoDescription')}
                                  </label>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleOpenUserReferenceDialog(index, album.id)}
                                  >
                                    <Link className="h-4 w-4 mr-2" />
                                    {t('person.tagPerson')}
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Input
                                    id={`photo-description-${index}`}
                                    value={photoDetail.description || ''}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value, album.id)}
                                    placeholder={t('person.enterPhotoDescription')}
                                  />
                                </div>
                                {photoDetail.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {formatDescriptionWithUserLinks(photoDetail.description)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(index, album.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Carousel className="w-full max-w-md mx-auto mt-6">
                    <CarouselContent>
                      {album.photos.map((photoDetail, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <div className="overflow-hidden rounded-md">
                              <img 
                                src={photoDetail.url} 
                                alt={photoDetail.description || `${person.firstName} ${person.lastName} - Photo ${index + 1}`}
                                className="h-60 w-full object-cover"
                              />
                              {photoDetail.description && (
                                <p className="mt-2 text-sm text-center text-muted-foreground">
                                  {formatDescriptionWithUserLinks(photoDetail.description)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Images className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t('person.noPhotos')}</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Images className="mr-2 h-4 w-4" />
              {t('person.addPhoto')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {activeAlbum 
                  ? `${t('person.addPhotoToAlbum')} "${activeAlbum.name}"`
                  : t('person.addPhotoToGallery')
                }
              </DialogTitle>
            </DialogHeader>
            <ImageUpload
              onImageChange={handleImageChange}
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={isNewAlbumOpen} onOpenChange={setIsNewAlbumOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('person.createNewAlbum')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="album-name" className="text-sm font-medium">
                  {t('person.albumName')}
                </label>
                <Input
                  id="album-name"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder={t('person.enterAlbumName')}
                />
              </div>
              <Button 
                onClick={handleCreateAlbum}
                disabled={!newAlbumName.trim()}
                className="w-full"
              >
                {t('person.createAlbum')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isRenameAlbumOpen} onOpenChange={setIsRenameAlbumOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('person.renameAlbum')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="new-album-name" className="text-sm font-medium">
                  {t('person.newAlbumName')}
                </label>
                <Input
                  id="new-album-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('person.enterNewAlbumName')}
                />
              </div>
              <Button 
                onClick={handleRenameAlbum}
                disabled={!newName.trim()}
                className="w-full"
              >
                {t('person.saveAlbumName')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('person.deleteAlbum')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>{t('person.deleteAlbumConfirmation')}</p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfirmDeleteOpen(false)}
                >
                  {t('person.cancel')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAlbum}
                >
                  {t('person.confirmDelete')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isUserReferenceDialogOpen} onOpenChange={setIsUserReferenceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('person.tagPersonInPhoto')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">{t('person.selectPersonToTag')}</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {people
                  .filter(p => p.id !== person.id)
                  .map(p => (
                    <div 
                      key={p.id} 
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => handleAddUserReference(p.id)}
                    >
                      <Avatar className="h-10 w-10">
                        {p.photo ? (
                          <AvatarImage src={p.photo} alt={`${p.firstName} ${p.lastName}`} />
                        ) : (
                          <AvatarFallback>
                            {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{p.firstName} {p.lastName}</p>
                        {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
