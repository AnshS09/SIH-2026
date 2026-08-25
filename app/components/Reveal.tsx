'use client';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** delay before the animation starts, in seconds */
  delay?: number;
  /** direction the content travels in from */
  direction?: Direction;
  className?: string;
  /** animation duration, in seconds */
  duration?: number;
  /** fraction of the element that must be visible before it triggers */
  threshold?: number;
  /** replay the animation every time it re-enters the viewport */
  repeat?: boolean;
  style?: CSSProperties;
}

const OFFSETS: Record<Direction, string> = {
  up: 'translateY(32px)',
  down: 'translateY(-32px)',
  left: 'translateX(32px)',
  right: 'translateX(-32px)',
  none: 'scale(0.98)',
};

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  duration = 0.9,
  threshold = 0.15,
  repeat = false,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!repeat) observer.unobserve(el);
          } else if (repeat) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0) scale(1)' : OFFSETS[direction],
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
