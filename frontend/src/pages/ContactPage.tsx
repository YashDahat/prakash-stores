import type { JSX } from 'react';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocationMap } from '@/components/contact/LocationMap';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/siteConfig';

export default function ContactPage(): React.JSX.Element {
  const { address, phone, email, openingHours } = siteConfig.footer;

  // Coordinates for Prakash Stores (example, replace with actual coordinates if available)
  const latitude = 28.6139; // Example latitude for Delhi
  const longitude = 77.2090; // Example longitude for Delhi

  return (
    <div className="container mx-auto py-12 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We'd love to hear from you! Reach out to us with any questions or feedback.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-[#212121] mb-4">Our Details</h2>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E87A00] mb-2">Address</h3>
            <p className="text-gray-700">{address}</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E87A00] mb-2">Phone</h3>
            <p className="text-gray-700">{phone}</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E87A00] mb-2">Email</h3>
            <p className="text-gray-700">{email}</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E87A00] mb-2">Opening Hours</h3>
            <p className="text-gray-700">{openingHours}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-[#212121] mb-4">Send Us a Message</h2>
          <ContactForm />
        </div>
      </section>

      <Separator className="my-12" />

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-[#212121] text-center mb-8">Find Us on the Map</h2>
        <div className="rounded-xl shadow-md overflow-hidden h-[400px] md:h-[500px]">
          <LocationMap latitude={latitude} longitude={longitude} />
        </div>
      </section>
    </div>
  );
}