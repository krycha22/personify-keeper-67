
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { usePeople } from '@/context/PeopleContext';
import PersonCard from '@/components/people/PersonCard';
import SearchBar from '@/components/people/SearchBar';
import { UserPlus } from 'lucide-react';

const People = () => {
  const { people, searchPeople, deletePerson } = usePeople();
  const [searchResults, setSearchResults] = useState(people);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('q') || '';
  
  useEffect(() => {
    // Apply the search when people data changes or search query changes
    handleSearch(queryFromUrl);
  }, [people, queryFromUrl]);

  const handleSearch = (query: string) => {
    // Update URL with search query
    if (query) {
      navigate(`/people?q=${encodeURIComponent(query)}`, { replace: true });
    } else {
      navigate('/people', { replace: true });
    }
    
    // Filter people based on search query
    setSearchResults(searchPeople(query));
  };

  const handleDelete = (id: string) => {
    deletePerson(id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">People</h1>
          <p className="text-muted-foreground">
            Manage and view your people profiles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchBar onSearch={handleSearch} initialQuery={queryFromUrl} />
          <Button asChild>
            <Link to="/people/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Person
            </Link>
          </Button>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/20">
            {queryFromUrl ? (
              <>
                <h3 className="font-medium mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No people profiles match your search criteria.
                </p>
                <Button variant="outline" onClick={() => handleSearch('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-medium mb-2">No people profiles yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by adding your first person profile
                </p>
                <Button asChild>
                  <Link to="/people/new">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Person
                  </Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default People;
