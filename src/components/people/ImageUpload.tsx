
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadIcon, X } from "lucide-react";

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (imageBase64: string | undefined) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ initialImage, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center">
        {previewUrl ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full w-6 h-6"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleUploadClick}
        className="w-full"
      >
        <UploadIcon className="mr-2 h-4 w-4" />
        {previewUrl ? 'Change Photo' : 'Upload Photo'}
      </Button>
    </div>
  );
};

export default ImageUpload;
