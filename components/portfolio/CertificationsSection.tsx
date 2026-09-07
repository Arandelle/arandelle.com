'use client';

import React from 'react';
import { Award, ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  url: string | null;
  date: string | null;
}

const CertificationsSection: React.FC<{ certifications: Certification[] }> = ({ certifications }) => {
  const ref = useReveal();

  return (
    <section
      id="certifications"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
            05 — Certifications
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-4xl sm:text-5xl md:text-6xl">
            Credentials &{' '}
            <span className="text-angled-reverse">learning.</span>
          </h2>
        </div>

        {/* Cert list */}
        <div className="mt-16 space-y-4">
          {certifications.map((cert, i) => (
            <a
              key={cert.id}
              href={cert.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group flex items-center gap-6 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover-lift"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Award className="h-5 w-5 text-ink dark:text-gray-300" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate group-hover:text-ink dark:group-hover:text-white transition-colors">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {cert.issuer}
                </p>
                {cert.date && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mt-2">
                    {cert.date}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-ink dark:group-hover:text-white transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
