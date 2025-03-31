
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
import { Images, Trash2, GalleryHorizontal, FolderPlus, Pencil } from 'lucide-react';

interface PhotoGalleryProps {
  person: Person;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ person }) => {
  const { t } = useLanguage();
  const { addPhotoToGallery, removePhotoFromGallery, updatePhotoDescription, addPhotoAlbum, removePhotoAlbum, renamePhotoAlbum } = usePeople();
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isNewAlbumOpen, setIsNewAlbumOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("album-general");
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [isRenameAlbumOpen, setIsRenameAlbumOpen] = useState(false);
  const [albumToRename, setAlbumToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  
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
  
  const getActiveAlbum = (): PhotoAlbum | undefined => {
    return person.photoAlbums?.find(album => album.id === selectedAlbumId);
  };
  
  const isDefaultAlbum = (albumId: string): boolean => {
    return ["album-me", "album-general", "album-friends"].includes(albumId);
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
                {!isDefaultAlbum(album.id) && (
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
                                <label htmlFor={`photo-description-${index}`} className="text-sm font-medium">
                                  {t('person.photoDescription')}
                                </label>
                                <Input
                                  id={`photo-description-${index}`}
                                  value={photoDetail.description || ''}
                                  onChange={(e) => handleDescriptionChange(index, e.target.value, album.id)}
                                  placeholder={t('person.enterPhotoDescription')}
                                />
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
                                  {photoDetail.description}
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
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
