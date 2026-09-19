<section className="py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A6D] mb-8 text-center">About Prakash Stores</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-[#1A3A6D]">Our Story</h2>
        <p className="text-[#212121] leading-relaxed">
          Prakash Stores began its journey decades ago with a simple vision: to provide quality apparel and a delightful shopping experience to families in our community. What started as a small, humble shop has grown into a beloved local institution, built on trust, tradition, and a deep understanding of our customers' needs. We've seen generations come through our doors, and each visit reinforces our commitment to being more than just a store – we're a part of your family's story.
        </p>
        <p className="text-[#212121] leading-relaxed">
          From carefully selected fabrics to timeless designs, every item at Prakash Stores is chosen with you in mind. We believe in clothing that lasts, that feels good, and that helps you express your unique style. Our heritage is woven into every thread, and we're proud to continue serving you with the same dedication that has defined us for years.
        </p>
      </div>
      <div className="flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
          alt="Prakash Stores History"
          className="rounded-lg shadow-lg max-h-[400px] object-cover"
        />
      </div>
    </div>

    <Separator className="my-16 bg-gray-200" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="flex justify-center order-2 md:order-1">
        <img
          src="https://images.unsplash.com/photo-1516575003027-e4569527f394?w=800&q=80"
          alt="Prakash Stores Values"
          className="rounded-lg shadow-lg max-h-[400px] object-cover"
        />
      </div>
      <div className="space-y-6 order-1 md:order-2">
        <h2 className="text-3xl font-semibold text-[#1A3A6D]">Our Values</h2>
        <p className="text-[#212121] leading-relaxed">
          At Prakash Stores, our business is guided by a core set of values that reflect our commitment to excellence and integrity.
        </p>
        <ul className="list-disc list-inside text-[#212121] leading-relaxed space-y-2">
          <li>
            <strong>Quality:</strong> We source only the finest materials and partner with trusted manufacturers to ensure every product meets our high standards.
          </li>
          <li>
            <strong>Customer Focus:</strong> Your satisfaction is our priority. We strive to create a welcoming environment and provide personalized service that makes every visit special.
          </li>
          <li>
            <strong>Integrity:</strong> Honesty and transparency are at the heart of everything we do. We believe in fair pricing and ethical business practices.
          </li>
          <li>
            <strong>Community:</strong> We are proud to be a part of this community and actively seek ways to give back and support local initiatives.
          </li>
        </ul>
      </div>
    </div>

    <Separator className="my-16 bg-gray-200" />

    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-semibold text-[#1A3A6D]">Community Focus</h2>
      <p className="text-[#212121] leading-relaxed max-w-3xl mx-auto">
        Being a local business, Prakash Stores is deeply invested in the well-being of our community. We believe in fostering strong relationships, not just with our customers, but with our neighbors and local organizations. We regularly participate in local events, support charitable causes, and strive to create a positive impact wherever we can. When you shop with us, you're not just buying clothes; you're supporting a business that cares about the place we all call home.
      </p>
      <p className="text-[#212121] leading-relaxed max-w-3xl mx-auto">
        Thank you for being a part of the Prakash Stores family. We look forward to serving you for many more years to come.
      </p>
    </div>
  </div>
</section>
import { Separator } from '@/components/ui/separator';

export default function AboutPage(): React.JSX.Element {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A6D] mb-8 text-center">About Prakash Stores</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#1A3A6D]">Our Story</h2>
            <p className="text-[#212121] leading-relaxed">
              Prakash Stores began its journey decades ago with a simple vision: to provide quality apparel and a delightful shopping experience to families in our community. What started as a small, humble shop has grown into a beloved local institution, built on trust, tradition, and a deep understanding of our customers' needs. We've seen generations come through our doors, and each visit reinforces our commitment to being more than just a store – we're a part of your family's story.
            </p>
            <p className="text-[#212121] leading-relaxed">
              From carefully selected fabrics to timeless designs, every item at Prakash Stores is chosen with you in mind. We believe in clothing that lasts, that feels good, and that helps you express your unique style. Our heritage is woven into every thread, and we're proud to continue serving you with the same dedication that has defined us for years.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
              alt="Prakash Stores History"
              className="rounded-lg shadow-lg max-h-[400px] object-cover"
            />
          </div>
        </div>

        <Separator className="my-16 bg-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1516575003027-e4569527f394?w=800&q=80"
              alt="Prakash Stores Values"
              className="rounded-lg shadow-lg max-h-[400px] object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-semibold text-[#1A3A6D]">Our Values</h2>
            <p className="text-[#212121] leading-relaxed">
              At Prakash Stores, our business is guided by a core set of values that reflect our commitment to excellence and integrity.
            </p>
            <ul className="list-disc list-inside text-[#212121] leading-relaxed space-y-2">
              <li>
                <strong>Quality:</strong> We source only the finest materials and partner with trusted manufacturers to ensure every product meets our high standards.
              </li>
              <li>
                <strong>Customer Focus:</strong> Your satisfaction is our priority. We strive to create a welcoming environment and provide personalized service that makes every visit special.
              </li>
              <li>
                <strong>Integrity:</strong> Honesty and transparency are at the heart of everything we do. We believe in fair pricing and ethical business practices.
              </li>
              <li>
                <strong>Community:</strong> We are proud to be a part of this community and actively seek ways to give back and support local initiatives.
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-16 bg-gray-200" />

        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-semibold text-[#1A3A6D]">Community Focus</h2>
          <p className="text-[#212121] leading-relaxed max-w-3xl mx-auto">
            Being a local business, Prakash Stores is deeply invested in the well-being of our community. We believe in fostering strong relationships, not just with our customers, but with our neighbors and local organizations. We regularly participate in local events, support charitable causes, and strive to create a positive impact wherever we can. When you shop with us, you're not just buying clothes; you're supporting a business that cares about the place we all call home.
          </p>
          <p className="text-[#212121] leading-relaxed max-w-3xl mx-auto">
            Thank you for being a part of the Prakash Stores family. We look forward to serving you for many more years to come.
          </p>
        </div>
      </div>
    </section>
  );
}