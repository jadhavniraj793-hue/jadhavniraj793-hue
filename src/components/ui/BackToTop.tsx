'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { smoothScrollTo } from '@/lib/hooks';

/** Floating "return to orbit" button, appears after the hero. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => setShow(value > 900));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => smoothScrollTo('#home', 0)}
          aria-label="Back to top"
          className="fixed bottom-6 right-5 z-40 grid h-11 w-11 place-items-center rounded-full glass text-aqua shadow-[0_0_30px_-8px_rgba(0,245,212,0.65)] sm:bottom-8 sm:right-8"
        >
          <ArrowUp className="h-4.5 w-4.5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
