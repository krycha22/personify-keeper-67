
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CustomFieldsList from '@/components/settings/CustomFieldsList';
import CustomFieldForm from '@/components/settings/CustomFieldForm';
import { useAuth } from '@/context/AuthContext';
import { usePeople } from '@/context/PeopleContext';

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const { customFields, addCustomField, deleteCustomField } = usePeople();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your app settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CustomFieldsList 
              fields={customFields} 
              onDelete={deleteCustomField} 
            />
          </div>
          <div className="space-y-6">
            <CustomFieldForm 
              onAddField={addCustomField} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
