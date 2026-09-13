import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues): Promise<void> => {
    setError(null);
    try {
      await register(values);
      toast.success('Account created successfully! You are now logged in.');
      navigate(ROUTES.HOME);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-12 px-4 bg-[#F5F5F5]">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#212121]">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" data-testid="signup-firstName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" data-testid="signup-lastName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" data-testid="signup-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="9876543210" {...field} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" data-testid="signup-phone" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" data-testid="signup-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200"
              disabled={isLoading}
              data-testid="signup-submit"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Button variant="link" onClick={() => navigate(ROUTES.LOGIN)} className="p-0 h-auto text-[#E87A00] hover:text-[#D46A00]" data-testid="signup-login-link">
            Log In
          </Button>
        </p>
      </div>
    </section>
  );
}