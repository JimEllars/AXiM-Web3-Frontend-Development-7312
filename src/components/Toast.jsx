import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';

export default function Toast() {
  const toasts = useAximStore(state => state.toasts);
  const removeToast = useAximStore(state => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const typeStyles = {
    info: 'bg-axim-purple/20 border-axim-purple text-white',
    success: 'bg-emerald-950/80 border-emerald-500 text-emerald-200',
    error: 'bg-red-950/80 border-red-500 text-red-200',
    warning: 'bg-amber-950/80 border-amber-500 text-amber-200'
  };

  const currentStyle = typeStyles[toast.type] || typeStyles.info;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className={`px-6 py-4 rounded-sm border shadow-2xl font-mono text-xs uppercase tracking-widest backdrop-blur-md flex items-center gap-3 ${currentStyle}`}
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
      {toast.message}
    </motion.div>
  );
}
