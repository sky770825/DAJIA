import { MessageCircle } from 'lucide-react';
import { contactInfo } from '@/data/contact';

export function FloatingLineButton() {
  return (
    <a
      href={contactInfo.line.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-line text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl md:h-16 md:w-16"
      aria-label="加入官方 LINE"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  );
}
