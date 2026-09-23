import React from 'react';
import { Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      <span>{message}</span>
    </div>
  );
};
