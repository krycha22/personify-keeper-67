
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomFieldsList from '@/components/settings/CustomFieldsList';
import CustomFieldForm from '@/components/settings/CustomFieldForm';
import { usePeople } from '@/context/PeopleContext';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { customFields, addCustomField, deleteCustomField } = usePeople();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Przekieruj do strony logowania, jeśli użytkownik nie jest zalogowany
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Jeśli użytkownik nie jest zalogowany, nie renderuj zawartości strony
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>

        <Tabs defaultValue="fields">
          <TabsList>
            <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            {user.role === 'admin' && (
              <TabsTrigger value="admin">Admin Settings</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="fields" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>
                <CustomFieldsList 
                  fields={customFields} 
                  onDelete={deleteCustomField} 
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Add New Field</h2>
                <CustomFieldForm 
                  onAddField={addCustomField} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">General Settings</h2>
              <p className="text-muted-foreground">
                General application settings will be added here in future updates.
              </p>
            </div>
          </TabsContent>
          
          {user.role === 'admin' && (
            <TabsContent value="admin">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Admin Settings</h2>
                <p className="text-muted-foreground">
                  As an administrator, you can hide profiles from regular users.
                  Go to the People page and use the eye icon to toggle visibility.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
