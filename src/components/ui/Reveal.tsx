import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  once?: boolean;
  as?: "div" | "section" | "li" | "article" | "span";
};

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: -28 },
  right: { x: 28 },
  none: {},
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  as = "div",
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px 0px -60px 0px" }}
    >
      {children}
    </Component>
  );
}

/** Container that staggers its Reveal-like children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
