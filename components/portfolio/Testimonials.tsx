import React from 'react';
import { testimonials } from '@/lib/data';

const Testimonials: React.FC = () => {
  return (
    <div>
      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <figure key={i} className="border-l border-gray-200 pl-5">
            <blockquote className="font-serif text-[17px] leading-[1.75] text-gray-500 italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3">
              <span className="text-[15px] font-semibold tracking-tight text-foreground">{t.name}</span>
              <span className="font-mono-label text-[11px] tracking-[0.5px] text-gray-400"> · {t.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
