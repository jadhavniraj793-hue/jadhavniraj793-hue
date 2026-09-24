import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  label?: string;
}

/** Glass modal with backdrop blur, spring zoom-in and ESC/overlay close. */
export function Modal({ open, onClose, children, maxWidth = 'max-w-2xl', label }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.82, y: 48, rotateX: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 28, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 230, damping: 24 }}
            className={cn(
              'relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-abyss/95 shadow-glow backdrop-blur-2xl',
              maxWidth,
            )}
            style={{ perspective: 1200 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-30 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:rotate-90 hover:border-violet-400/40 hover:text-white"
            >
              <X size={17} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
