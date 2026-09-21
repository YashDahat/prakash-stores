// GENERATED from the architecture plan — do not edit by hand.
// The complete navigation contract: every page, its route, and its nav
// metadata. Link via ROUTES.*, render nav from routeTable — never hardcode
// a path string. This file imports NOTHING by design (cycle-safe).

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CHECKOUT: '/checkout',
  CONTACT: '/contact',
  EVENTS: '/events',
  LOGIN: '/login',
  ORDER_CONFIRMATION: '/order-confirmation',
  ORDER_HISTORY: '/order-history',
  PRODUCT_DETAIL: '/product/:id',
  PRODUCTS: '/products',
  PROFILE: '/profile',
  SIGNUP: '/signup',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_REVIEWS: '/admin/reviews',
  NOT_FOUND: '*',
  CART: '/cart',
  GALLERY: '/gallery',
  ADMIN_MEDIA: '/admin/media',
} as const;

export type RouteGate = 'public' | 'auth' | 'admin';

export interface RouteEntry {
  key: keyof typeof ROUTES;
  path: string;
  page: string;        // component name, e.g. 'AdminOrdersPage'
  importPath: string;  // string metadata only — App.tsx does the importing
  label: string;
  gate: RouteGate;     // 'public' | 'auth' (login) | 'admin' (login + role)
  nav: boolean;
}

export const routeTable: RouteEntry[] = [
  { key: 'HOME', path: ROUTES.HOME, page: 'HomePage', importPath: './pages/HomePage', label: 'Home', gate: 'public', nav: true },
  { key: 'ABOUT', path: ROUTES.ABOUT, page: 'AboutPage', importPath: './pages/AboutPage', label: 'About', gate: 'public', nav: true },
  { key: 'CHECKOUT', path: ROUTES.CHECKOUT, page: 'CheckoutPage', importPath: './pages/CheckoutPage', label: 'Checkout', gate: 'auth', nav: false },
  { key: 'CONTACT', path: ROUTES.CONTACT, page: 'ContactPage', importPath: './pages/ContactPage', label: 'Contact', gate: 'public', nav: true },
  { key: 'EVENTS', path: ROUTES.EVENTS, page: 'EventsPage', importPath: './pages/EventsPage', label: 'Events', gate: 'public', nav: true },
  { key: 'LOGIN', path: ROUTES.LOGIN, page: 'LoginPage', importPath: './pages/LoginPage', label: 'Login', gate: 'public', nav: false },
  { key: 'ORDER_CONFIRMATION', path: ROUTES.ORDER_CONFIRMATION, page: 'OrderConfirmationPage', importPath: './pages/OrderConfirmationPage', label: 'Order Confirmation', gate: 'public', nav: true },
  { key: 'ORDER_HISTORY', path: ROUTES.ORDER_HISTORY, page: 'OrderHistoryPage', importPath: './pages/account/OrderHistoryPage', label: 'Order History', gate: 'public', nav: true },
  { key: 'PRODUCT_DETAIL', path: ROUTES.PRODUCT_DETAIL, page: 'ProductDetailPage', importPath: './pages/ProductDetailPage', label: 'Product', gate: 'public', nav: false },
  { key: 'PRODUCTS', path: ROUTES.PRODUCTS, page: 'ProductsPage', importPath: './pages/ProductsPage', label: 'Products', gate: 'public', nav: true },
  { key: 'PROFILE', path: ROUTES.PROFILE, page: 'ProfilePage', importPath: './pages/account/ProfilePage', label: 'Profile', gate: 'public', nav: true },
  { key: 'SIGNUP', path: ROUTES.SIGNUP, page: 'SignupPage', importPath: './pages/SignupPage', label: 'Signup', gate: 'public', nav: false },
  { key: 'ADMIN_DASHBOARD', path: ROUTES.ADMIN_DASHBOARD, page: 'AdminDashboardPage', importPath: './pages/admin/AdminDashboardPage', label: 'Dashboard', gate: 'admin', nav: true },
  { key: 'ADMIN_EVENTS', path: ROUTES.ADMIN_EVENTS, page: 'AdminEventsPage', importPath: './pages/admin/AdminEventsPage', label: 'Events', gate: 'admin', nav: true },
  { key: 'ADMIN_ORDERS', path: ROUTES.ADMIN_ORDERS, page: 'AdminOrdersPage', importPath: './pages/admin/AdminOrdersPage', label: 'Orders', gate: 'admin', nav: true },
  { key: 'ADMIN_PRODUCTS', path: ROUTES.ADMIN_PRODUCTS, page: 'AdminProductsPage', importPath: './pages/admin/AdminProductsPage', label: 'Products', gate: 'admin', nav: true },
  { key: 'ADMIN_REVIEWS', path: ROUTES.ADMIN_REVIEWS, page: 'AdminReviewsPage', importPath: './pages/admin/AdminReviewsPage', label: 'Reviews', gate: 'admin', nav: true },
  { key: 'NOT_FOUND', path: ROUTES.NOT_FOUND, page: 'NotFoundPage', importPath: './pages/NotFoundPage', label: 'Not Found', gate: 'public', nav: false },
  { key: 'CART', path: ROUTES.CART, page: 'CartPage', importPath: './pages/CartPage', label: 'Cart', gate: 'public', nav: false },
  { key: 'GALLERY', path: ROUTES.GALLERY, page: 'GalleryPage', importPath: './pages/GalleryPage', label: 'Gallery', gate: 'public', nav: true },
  { key: 'ADMIN_MEDIA', path: ROUTES.ADMIN_MEDIA, page: 'AdminMediaPage', importPath: './pages/admin/AdminMediaPage', label: 'Media', gate: 'admin', nav: true },
];
