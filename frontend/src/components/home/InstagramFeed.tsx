import { Heart, MessageCircle } from 'lucide-react';

export default function InstagramFeed() {
  const instagramPosts = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-c1924035f792?w=800&q=80',
      likes: 123,
      comments: 15,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-79dec2f81076?w=800&q=80',
      likes: 245,
      comments: 30,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?w=800&q=80',
      likes: 98,
      comments: 8,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      likes: 301,
      comments: 42,
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1585386959984-a415d06810f2?w=800&q=80',
      likes: 187,
      comments: 20,
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111623813?w=800&q=80',
      likes: 400,
      comments: 55,
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-[#212121]">
          Follow us on Instagram
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-105"
            >
              <img
                src={post.imageUrl}
                alt={`Instagram post ${post.id}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="flex items-center text-white text-lg font-semibold space-x-4">
                  <span className="flex items-center">
                    <Heart className="w-5 h-5 mr-1" /> {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-1" /> {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/prakashstores/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Follow @prakashstores
          </a>
        </div>
      </div>
    </section>
  );
}