import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton(): React.JSX.Element {
  const phoneNumber = '+919371025731';
  const prefilledMessage = 'Hello Prakash Stores, I have a question about...';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50"
      data-testid="whatsapp-cta"
    >
      <Button
        className="bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full p-4 shadow-lg transition-all duration-200"
        size="icon"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
}