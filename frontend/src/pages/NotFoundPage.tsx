import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';

const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className="py-16 px-4 min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-[#1A3A6D] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-[#212121] mb-6">Oops! Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
          <Link to={ROUTES.HOME}>Go to Homepage</Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFoundPage;