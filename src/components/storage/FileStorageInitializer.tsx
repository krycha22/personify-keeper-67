
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { initializeFileStorage, isFileSystemAPISupported } from '@/utils/fileStorage';
import { useToast } from "@/hooks/use-toast";
import { FolderOpen } from 'lucide-react';

interface FileStorageInitializerProps {
  onInitialized: () => void;
}

const FileStorageInitializer: React.FC<FileStorageInitializerProps> = ({ onInitialized }) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported(isFileSystemAPISupported());
  }, []);

  const handleInitialize = async () => {
    try {
      const success = await initializeFileStorage();
      if (success) {
        toast({
          title: "Storage initialized",
          description: "File storage has been successfully set up.",
        });
        onInitialized();
      } else {
        toast({
          title: "Initialization failed",
          description: "Could not initialize file storage. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
      toast({
        title: "Initialization failed",
        description: "An error occurred while setting up file storage.",
        variant: "destructive",
      });
    }
  };

  if (isSupported === null) {
    return <div>Checking browser compatibility...</div>;
  }

  if (isSupported === false) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Unsupported Browser</CardTitle>
          <CardDescription>
            Your browser doesn't support the File System Access API needed for local file storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please use a modern browser like Chrome, Edge, or Opera to use this feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Up File Storage</CardTitle>
        <CardDescription>
          PersonifyKeeper needs permission to save data to a local folder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          You'll be prompted to select a folder where all application data (including people profiles, settings, and photos) will be stored.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInitialize} className="w-full">
          <FolderOpen className="w-4 h-4 mr-2" />
          Choose Storage Location
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileStorageInitializer;
