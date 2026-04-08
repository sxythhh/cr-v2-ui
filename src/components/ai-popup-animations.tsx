"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

const ANIM = {
  enter: { opacity: 0, scale: 0.15, borderRadius: "50%" },
  visible: { opacity: 1, scale: 1, borderRadius: "0%" },
  exit: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  enterTransition: { type: "spring" as const, stiffness: 340, damping: 28, mass: 0.8 },
  exitTransition: { duration: 0.15, ease: [0.5, 0, 1, 0.5] as [number, number, number, number] },
};

export function AiPopupAnimated({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={ANIM.enter}
          animate={{ ...ANIM.visible, transition: ANIM.enterTransition }}
          exit={{ ...ANIM.exit, transition: ANIM.exitTransition }}
          style={{
            transformOrigin: "bottom right",
            willChange: "transform, opacity, filter",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
