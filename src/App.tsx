
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
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { PeopleProvider } from "./context/PeopleContext";
import { LanguageProvider } from "./context/LanguageContext";
import { FieldRequirementsProvider } from "./context/FieldRequirementsContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <FieldRequirementsProvider>
            <PeopleProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/people" element={
                      <ProtectedRoute>
                        <People />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/people/new" element={
                      <ProtectedRoute>
                        <PersonForm />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/people/:id" element={
                      <ProtectedRoute>
                        <PersonView />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/people/:id/edit" element={
                      <ProtectedRoute>
                        <PersonForm />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </PeopleProvider>
          </FieldRequirementsProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
