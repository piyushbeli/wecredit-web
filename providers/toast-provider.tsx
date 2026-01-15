'use client';

/**
 * Toast Provider
 * Wraps the app with Sonner toast notifications
 */

import { Toaster } from 'sonner';

/**
 * Toast Provider Component
 * Renders the global toast container with custom styling
 */
export function ToastProvider(): React.ReactNode {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          error: 'border-red-500 bg-red-50 text-red-900',
          success: 'border-green-500 bg-green-50 text-green-900',
          warning: 'border-yellow-500 bg-yellow-50 text-yellow-900',
          info: 'border-blue-500 bg-blue-50 text-blue-900',
        },
      }}
      duration={3000}
      closeButton
      richColors
    />
  );
}
