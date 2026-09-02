import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success('Login successful!');
      const redirectPath = new URLSearchParams(location.search).get('redirect') || ROUTES.HOME;
      navigate(redirectPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error('Login failed', { description: errorMessage });
    }
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex justify-center">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Email or Phone</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent"
                  data-testid="login-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200"
                disabled={isLoading}
                data-testid="login-submit"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to={ROUTES.SIGNUP} className="text-[#E87A00] hover:underline transition-all duration-200">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}