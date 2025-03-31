
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePeople } from '@/context/PeopleContext';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Settings, Search } from 'lucide-react';

const Index = () => {
  const { people } = usePeople();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">PersonifyKeeper Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your contacts with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-primary-foreground p-4 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{people.length}</h2>
                <p className="text-muted-foreground">Total People</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="h-full flex flex-col justify-between">
                <h3 className="font-medium mb-2">Add New Person</h3>
                <p className="text-sm mb-4 opacity-90">
                  Create a new profile for a person
                </p>
                <Button asChild variant="secondary" className="w-full mt-auto">
                  <Link to="/people/new">
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Person
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-full flex flex-col justify-between">
                <h3 className="font-medium mb-2">Browse People</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and search all stored profiles
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link to="/people">
                    <Search className="mr-2 h-4 w-4" />
                    Browse People
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-full flex flex-col justify-between">
                <h3 className="font-medium mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the application
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Profiles</h2>
          {people.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {people.slice(0, 3).map(person => (
                <Card key={person.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border bg-muted">
                        {person.photo ? (
                          <img 
                            src={person.photo} 
                            alt={`${person.firstName} ${person.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <span className="text-primary font-bold">
                              {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {person.firstName} {person.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{person.email}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="ghost" className="w-full">
                        <Link to={`/people/${person.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <h3 className="font-medium mb-2">No profiles yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first person profile
              </p>
              <Button asChild>
                <Link to="/people/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Person
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
