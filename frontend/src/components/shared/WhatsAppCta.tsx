import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppCta(): React.JSX.Element {
  const phoneNumber = '919371025731'; // Business phone number for WhatsApp
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="rounded-full w-16 h-16 bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg transition-all duration-200"
        data-testid="whatsapp-cta"
      >
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={32} />
          <span className="sr-only">Chat on WhatsApp</span>
        </a>
      </Button>
    </div>
  );
}