
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePeople } from '@/context/PeopleContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { people, togglePersonVisibility } = usePeople();
  const { toast } = useToast();
  const [showHidden, setShowHidden] = useState(false);

  const handleToggleVisibility = (id: string) => {
    togglePersonVisibility(id);
    toast({
      title: "Visibility updated",
      description: "Person visibility has been updated.",
    });
  };

  const filteredPeople = showHidden 
    ? people 
    : people.filter(person => !person.isHidden);

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage visibility of people in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="show-hidden" 
                checked={showHidden}
                onCheckedChange={setShowHidden}
              />
              <label htmlFor="show-hidden">Show hidden profiles</label>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map(person => (
                  <TableRow key={person.id}>
                    <TableCell>{person.firstName} {person.lastName}</TableCell>
                    <TableCell>{person.isHidden ? 'Hidden' : 'Visible'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleVisibility(person.id)}
                      >
                        {person.isHidden ? (
                          <><Eye className="mr-2 h-4 w-4" /> Show</>
                        ) : (
                          <><EyeOff className="mr-2 h-4 w-4" /> Hide</>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPeople.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No people found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
