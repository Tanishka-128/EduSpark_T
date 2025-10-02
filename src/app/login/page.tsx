'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { updateProfile } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.'}),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (error: any) => {
    setIsLoading(false);
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/user-not-found':
                setError('No user found with this email.');
                break;
            case 'auth/wrong-password':
                setError('Incorrect password. Please try again.');
                break;
            case 'auth/email-already-in-use':
                setError('This email is already registered.');
                break;
            case 'auth/weak-password':
                setError('Password is too weak. It must be at least 6 characters long.');
                break;
            default:
                setError('An unexpected error occurred. Please try again.');
                break;
        }
    } else {
      setError('An unknown error occurred.');
    }
  };

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await initiateEmailSignIn(auth, values.email, values.password);
      // onAuthStateChanged will handle redirect
    } catch (e) {
      handleAuthError(e);
    }
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
      if (userCredential && userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: values.username,
        });
      }
      // onAuthStateChanged will handle redirect
    } catch (e) {
      handleAuthError(e);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {error && (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
            </div>
        )}
        
        <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)}>
                  <CardContent className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
        </TabsContent>

        <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join our community of learners today!</CardDescription>
              </CardHeader>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)}>
                  <CardContent className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="your_username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Register
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
