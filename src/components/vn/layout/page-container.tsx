"use client";
// @ts-nocheck

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'min-h-screen bg-[#09090a] p-4 md:p-6 pt-16 md:pt-6 transition-[margin] duration-200',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.main>
  );
}
