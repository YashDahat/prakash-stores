import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsAppButton(): React.JSX.Element {
  const phoneNumber = '9371025731'; // Business phone number without leading 0 or +91
  const message = 'Hello! I have a question about Prakash Stores.';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50"
      aria-label="Chat with us on WhatsApp"
      data-testid="whatsapp-button"
    >
      <MessageCircle size={28} />
    </a>
  );
}