import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white text-[#212121]">
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/about-hero.jpg')" }}
        data-testid="about-hero-section"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our Story: Quality, Trust, Community
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Prakash Stores has been a cornerstone of our community for decades,
            built on a foundation of quality products and unwavering trust.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            A Legacy of Excellence
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Since our humble beginnings, Prakash Stores has grown into a beloved
            local institution. We started with a simple vision: to provide our
            neighbors with the freshest produce, the finest goods, and a
            shopping experience built on respect and genuine care. Over the
            years, while much has changed, our core values have remained the
            same.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#E87A00]">
                Quality
              </h3>
              <p className="leading-relaxed">
                We meticulously source every product, ensuring it meets our
                high standards for freshness, taste, and ethical production.
                From farm to shelf, quality is our promise.
              </p>
            </div>
            <div className="card p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#E87A00]">
                Trust
              </h3>
              <p className="leading-relaxed">
                Transparency and honesty are at the heart of everything we do.
                We believe in building lasting relationships with our customers
                through integrity and reliable service.
              </p>
            </div>
            <div className="card p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-[#E87A00]">
                Community
              </h3>
              <p className="leading-relaxed">
                Prakash Stores is more than just a shop; it's a gathering place.
                We actively support local initiatives and strive to be a positive
                force in the community we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Meet the People Behind Prakash Stores
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Our dedicated team is the backbone of Prakash Stores. With a passion
            for service and a deep understanding of our products, they ensure
            every visit is a pleasant one. We're proud to have a team that
            shares our commitment to excellence.
          </p>
          {/* Placeholder for team images/profiles if desired */}
          <div className="flex justify-center space-x-4">
            {/* <img src="/images/team-member-1.jpg" alt="Team Member 1" className="w-32 h-32 rounded-full object-cover shadow-md" />
            <img src="/images/team-member-2.jpg" alt="Team Member 2" className="w-32 h-32 rounded-full object-cover shadow-md" /> */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-[#1A3A6D] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Experience the Prakash Stores Difference
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            We invite you to visit us and discover the quality, service, and
            community spirit that define Prakash Stores.
          </p>
          <a
            href="/products"
            className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            data-testid="about-shop-now-cta"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;