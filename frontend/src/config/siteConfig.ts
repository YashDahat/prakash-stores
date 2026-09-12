// GENERATED from the architecture plan — do not edit by hand.
// Business shell configuration (brand, nav, contact) — DERIVED from the plan + brief.
// Header nav mirrors the public route table; never hand-edit. Design tokens are
// omitted on purpose — the fenced shell supplies its own theme defaults.
import type { SiteConfig } from '@/shell';

export const siteConfig: SiteConfig = {
  header: {
    brandName: "Prakash Stores",
    navLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Order Confirmation", href: "/order-confirmation" },
      { label: "Products", href: "/products" },
      { label: "Contact", href: "/contact" },
    ],
    showAuth: true,
    showCart: true,
  },
  footer: {
    brandName: "Prakash Stores",
    address: "Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020",
    phone: "093710 25731",
  },
};
