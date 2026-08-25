'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface RevealTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** base delay before the first word starts, in seconds */
  delay?: number;
  /** gap between each word's animation start, in seconds */
  stagger?: number;
  threshold?: number;
}

/**
 * Splits text into words and reveals them one-by-one, sliding up out of a
 * clipped mask, as the element scrolls into view. Designed for short
 * headline / eyebrow copy rather than long paragraphs.
 */
export default function RevealText({
  text,
  className = '',
  style,
  delay = 0,
  stagger = 0.05,
  threshold = 0.3,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            paddingBottom: '0.12em',
            marginBottom: '-0.12em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0%)' : 'translateY(120%)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}s, opacity 0.5s ease ${delay + i * stagger}s`,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
