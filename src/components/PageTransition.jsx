
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import React, { Suspense, useEffect } from 'react';
import GlobalLoader from './GlobalLoader';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  type: 'tween',
  ease: 'circOut',
  duration: 0.4
};

export default function PageTransition({ children }) {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
    >
      <Suspense fallback={<GlobalLoader />}>
        {children}
      </Suspense>
    </motion.div>
  );
}
