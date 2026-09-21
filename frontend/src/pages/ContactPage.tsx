import type { JSX } from 'react';
import React from 'react';

const ContactPage = (): React.JSX.Element => {
  const address = "Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020";
  const phoneNumber = "093710 25731";
  const openingHours = "Monday - Saturday: 10:00 AM - 8:00 PM, Sunday: Closed";
  const mapCoordinates = { lat: 18.562196, lng: 73.802953 };

  return (
    <div className="container mx-auto py-16 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A6D] mb-4">Contact Us</h1>
        <p className="text-lg text-[#212121] leading-relaxed">
          We'd love to hear from you! Reach out to us with any questions or feedback.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-[#1A3A6D] mb-4">Our Location</h2>
          <p className="text-[#212121] leading-relaxed mb-2">
            <strong>Address:</strong> {address}
          </p>
          <p className="text-[#212121] leading-relaxed mb-2">
            <strong>Phone:</strong> <a href={`tel:${phoneNumber}`} className="text-[#E87A00] hover:underline transition-all duration-200">{phoneNumber}</a>
          </p>
          <p className="text-[#212121] leading-relaxed">
            <strong>Opening Hours:</strong> {openingHours}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-[#1A3A6D] mb-4">Find Us on the Map</h2>
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-inner">
            <iframe
              title="Google Map of Prakash Stores"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.160166666666!2d${mapCoordinates.lng}!3d${mapCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${mapCoordinates.lat},${mapCoordinates.lng}!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="text-center card p-6">
        <h2 className="text-2xl font-semibold text-[#1A3A6D] mb-4">Have a question? Send us a message!</h2>
        <p className="text-[#212121] leading-relaxed">
          (Contact form placeholder - functionality to be added in a future update)
        </p>
        <div className="mt-6">
          {/* Placeholder for a future contact form */}
          <button className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200 cursor-not-allowed opacity-75">
            Send Message
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;