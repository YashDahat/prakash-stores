import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/siteConfig';

export default function ContactPage() {
  const address = siteConfig.footer.address ?? 'Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020';
  const phone = siteConfig.footer.phone ?? '093710 25731';
  const email = siteConfig.footer.email ?? 'info@prakashstores.com';
  const openingHours = siteConfig.footer.openingHours ?? 'Mon-Sat: 9 AM - 8 PM, Sun: Closed';

  // Google Maps coordinates for Prakash Stores
  const mapCoordinates = {
    lat: 18.562196,
    lng: 73.813639,
  };

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapCoordinates.lat},${mapCoordinates.lng}`;

  return (
    <div className="bg-white text-[#212121]">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-600">
            We'd love to hear from you! Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Our Showroom</h2>
              <p className="text-lg">{address}</p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-lg">
                <strong>Phone:</strong> <a href={`tel:${phone}`} className="text-[#E87A00] hover:underline transition-all duration-200">{phone}</a>
              </p>
              <p className="text-lg">
                <strong>Email:</strong> <a href={`mailto:${email}`} className="text-[#E87A00] hover:underline transition-all duration-200">{email}</a>
              </p>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Opening Hours</h2>
              <p className="text-lg">{openingHours}</p>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 mb-0">Find Us on Map</h2>
            <Separator className="mb-4" />
            <div className="w-full h-[400px] md:h-[500px] bg-gray-200">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prakash Stores Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}