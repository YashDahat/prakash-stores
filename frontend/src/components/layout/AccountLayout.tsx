import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps): React.JSX.Element {
  const navLinks = [
    { name: 'My Profile', href: ROUTES.PROFILE },
    { name: 'Order History', href: ROUTES.ORDER_HISTORY },
  ];

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account Navigation</h2>
          <nav>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="block py-2 px-3 rounded-md text-[#212121] hover:bg-gray-100 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="md:col-span-3 bg-white rounded-xl shadow-md p-6">
          {children}
        </main>
      </div>
    </section>
  );
}