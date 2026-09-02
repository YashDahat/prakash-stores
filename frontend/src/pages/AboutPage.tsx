import React from 'react';

export default function AboutPage() {
  return (
    <div className="text-[#212121] leading-relaxed">
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Prakash Stores: A Legacy of Trust and Quality Since 1985
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            The Prakash Stores Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-4">
                Prakash Stores began its journey in 1985, founded by Mr. Prakash
                Kumar with a vision to provide the community with high-quality
                products and unparalleled customer service. What started as a
                humble neighborhood shop has grown into a trusted name, known
                for its commitment to excellence and its deep roots in the local
                community.
              </p>
              <p className="mb-4">
                Over the decades, we have adapted to changing times, but our
                core values remain steadfast: integrity, quality, and customer
                satisfaction. We believe in building lasting relationships with
                our customers, treating each one like family.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
                alt="Prakash Stores interior"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Our Commitment to Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1587825140732-476b70124430?w=800&q=80"
                alt="Quality products"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div>
              <p className="mb-4">
                At Prakash Stores, quality is not just a word; it's a promise.
                We meticulously source our products from reliable suppliers,
                ensuring that every item on our shelves meets the highest
                standards. From fresh produce to household essentials, we stand
                behind the quality of everything we sell.
              </p>
              <p className="mb-4">
                Our dedicated team works tirelessly to maintain a clean,
                organized, and welcoming shopping environment. We are constantly
                listening to our customers' feedback and striving to improve our
                offerings and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Community and Future
          </h2>
          <p className="mb-4 max-w-3xl mx-auto">
            Prakash Stores is more than just a business; it's an integral part
            of the community. We actively participate in local initiatives and
            support various causes, believing in giving back to the people who
            have supported us throughout our journey.
          </p>
          <p className="mb-8 max-w-3xl mx-auto">
            As we look to the future, we are excited to continue growing,
            innovating, and serving our community with the same dedication and
            passion that has defined us for generations. Thank you for being a
            part of the Prakash Stores family.
          </p>
        </div>
      </section>
    </div>
  );
}