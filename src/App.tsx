
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import People from "./pages/People";
import PersonForm from "./pages/PersonForm";
import PersonView from "./pages/PersonView"; 
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import { PeopleProvider } from "./context/PeopleContext";
import { LanguageProvider } from "./context/LanguageContext";
import { FieldRequirementsProvider } from "./context/FieldRequirementsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <FieldRequirementsProvider>
          <PeopleProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/people/new" element={<PersonForm />} />
                  <Route path="/people/:id" element={<PersonView />} />
                  <Route path="/people/:id/edit" element={<PersonForm />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PeopleProvider>
        </FieldRequirementsProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
