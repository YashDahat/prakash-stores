import type { JSX } from 'react';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';

const LoginPage = (): React.JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || ROUTES.HOME;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      toast.success('Logged in successfully!');
      navigate(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      toast.error(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  return (
    <section className="py-12 px-4 min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center bg-[#F5F5F5]">
      <div className="max-w-md w-full">
        <Card className="p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1A3A6D]">Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Email or Phone</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value)}
                  required
                  className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                  data-testid="login-username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
                  required
                  className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                  data-testid="login-password"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200"
                disabled={isLoading}
                data-testid="login-submit"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to={ROUTES.SIGNUP} className="text-[#E87A00] hover:underline" data-testid="login-signup-link">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginPage;