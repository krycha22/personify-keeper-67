
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { usePeople } from '@/context/PeopleContext';
import { useNavigate } from 'react-router-dom';
import FileStorageInitializer from '@/components/storage/FileStorageInitializer';
import { Database, HardDrive } from 'lucide-react';

const FileStorageSetup: React.FC = () => {
  const { setFileStorageInitialized } = usePeople();
  const navigate = useNavigate();

  const handleStorageInitialized = () => {
    setFileStorageInitialized(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
            <HardDrive className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">File Storage Setup</CardTitle>
          <CardDescription>
            PersonifyKeeper needs to store your data locally on your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Local Storage Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    By storing data locally in a directory on your device:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 mt-2 space-y-1">
                    <li>Your data remains private and never leaves your device</li>
                    <li>You can easily backup or transfer your data</li>
                    <li>Photos and files are organized in a structured manner</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <FileStorageInitializer onInitialized={handleStorageInitialized} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileStorageSetup;
