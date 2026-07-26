'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number: string;
  message?: string;
  className?: string;
  fullWidth?: boolean;
  title?: string;
}

export default function WhatsAppButton({ 
  number, 
  message = "Здравствуйте! Я нашел ваш коворкинг на Kenzcore Space и хотел бы узнать...",
  className = "",
  fullWidth = false,
  title = "WhatsApp"
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2 
        bg-emerald-500 hover:bg-emerald-600 text-white 
        font-medium rounded-xl transition-all duration-200 
        shadow-sm hover:shadow-md active:scale-[0.98]
        px-6 py-3
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      <MessageCircle size={20} />
      <span>{title}</span>
    </a>
  );
}
