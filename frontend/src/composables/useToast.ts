import { reactive } from 'vue';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Shared, app-wide toast queue so any view can surface a non-blocking message
// instead of a native browser alert().
const toasts = reactive<Toast[]>([]);
let nextId = 1;

function show(message: string, type: ToastType = 'info', duration = 4000): number {
  const id = nextId++;
  toasts.push({ id, message, type });
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function dismiss(id: number): void {
  const index = toasts.findIndex(t => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

export function useToast() {
  return {
    toasts,
    show,
    dismiss,
    info: (message: string, duration?: number) => show(message, 'info', duration),
    success: (message: string, duration?: number) => show(message, 'success', duration),
    error: (message: string, duration?: number) => show(message, 'error', duration),
  };
}
