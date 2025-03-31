
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface LoginFormValues {
  username: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setError(null);
    
    const isSuccess = login(data.username, data.password);
    
    if (isSuccess) {
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy w aplikacji PersonifyKeeper",
      });
      navigate('/');
    } else {
      setError('Nieprawidłowa nazwa użytkownika lub hasło');
      toast({
        title: "Błąd logowania",
        description: "Nieprawidłowa nazwa użytkownika lub hasło",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">PersonifyKeeper</CardTitle>
          <CardDescription>
            Zaloguj się do swojego konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa użytkownika</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź nazwę użytkownika" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Wprowadź hasło" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && <p className="text-destructive text-sm">{error}</p>}
              
              <Button type="submit" className="w-full">
                Zaloguj się
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Dane testowe: admin/admin123 lub user/user123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
