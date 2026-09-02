import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const signupFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues): Promise<void> => {
    try {
      await authRegister(values);
      toast.success('Account created successfully! Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create account.';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#212121]">
          Create Your Account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="signup-firstName"
                    />
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
                    <Input
                      placeholder="Doe"
                      {...field}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="signup-lastName"
                    />
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
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="signup-email"
                    />
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
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      {...field}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="signup-phone"
                    />
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
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="signup-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200"
              disabled={form.formState.isSubmitting}
              data-testid="signup-submit"
            >
              {form.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#E87A00] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}