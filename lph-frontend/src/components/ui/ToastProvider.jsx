import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#06b6d4', // Cyan 500
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // Red 500
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
