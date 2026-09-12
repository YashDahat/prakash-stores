import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <section className="py-16 px-4 bg-[#F5F5F5] min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-[#1A3A6D] mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-[#212121] mb-6">Page Not Found</h2>
        <p className="text-lg text-[#212121] leading-relaxed mb-8">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to={ROUTES.HOME}>
          <Button
            className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            data-testid="back-home-cta"
          >
            Go to Homepage
          </Button>
        </Link>
      </div>
    </section>
  );
}