'use client';

import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const TOAST_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
} as const;

const TOAST_ICON_STYLES = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
} as const;

interface ToastItemProps {
  id: string;
  type: keyof typeof TOAST_ICONS;
  title: string;
  message?: string;
  onRemove: (id: string) => void;
}

function ToastItem({ id, type, title, message, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = TOAST_ICONS[type];

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(id), 200);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-200',
        TOAST_STYLES[type],
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 shrink-0', TOAST_ICON_STYLES[type])} />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {message && <p className="text-sm opacity-80">{message}</p>}
      </div>
      <button
        onClick={handleRemove}
        className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}
