
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from '@/context/LanguageContext';
import { usePeople, Person } from '@/context/PeopleContext';
import ImageUpload from '@/components/people/ImageUpload';
import { Images, Trash2, GalleryHorizontal } from 'lucide-react';

interface PhotoGalleryProps {
  person: Person;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ person }) => {
  const { t } = useLanguage();
  const { addPhotoToGallery, removePhotoFromGallery, updatePhotoDescription } = usePeople();
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  
  const handleImageChange = (imageBase64: string | undefined) => {
    if (imageBase64 && person.id) {
      addPhotoToGallery(person.id, imageBase64, '');
      setIsAddPhotoOpen(false);
    }
  };
  
  const handleRemovePhoto = (index: number) => {
    if (person.id) {
      removePhotoFromGallery(person.id, index);
      if (viewingPhotoIndex === index) {
        setViewingPhotoIndex(null);
      }
    }
  };

  const handleDescriptionChange = (index: number, description: string) => {
    if (person.id) {
      updatePhotoDescription(person.id, index, description);
    }
  };
  
  const photos = person.photoDetails || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5" />
          {t('person.photoGallery')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photoDetail, index) => (
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
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
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
                      handleRemovePhoto(index);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Carousel className="w-full max-w-md mx-auto mt-6">
              <CarouselContent>
                {photos.map((photoDetail, index) => (
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
        
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Images className="mr-2 h-4 w-4" />
              {t('person.addPhoto')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CardTitle className="mb-4">{t('person.addPhotoToGallery')}</CardTitle>
            <ImageUpload
              onImageChange={handleImageChange}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
