import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  username: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>): Promise<void> => {
    try {
      await login(values.username, values.password);
      toast.success('Logged in successfully!');
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-12 px-4 bg-[#F5F5F5]">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center text-[#212121] mb-6">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username">Email or Phone</Label>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder="Enter your email or phone"
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="login-username"
                      {...field}
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
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                      data-testid="login-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200"
              disabled={isLoading}
              data-testid="login-submit"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-[#212121]">
          <Link to="#" className="text-[#E87A00] hover:underline">
            Forgot Password?
          </Link>
          <p className="mt-4">
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="text-[#E87A00] hover:underline" data-testid="login-signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}