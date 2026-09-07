'use client';

import React from 'react';
import { useReveal } from '@/lib/useReveal';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

const ExperienceSection: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  const ref = useReveal();

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20 bg-gray-50/80 dark:bg-white/[0.02]"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            02 — Experience
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Where I&apos;ve
            <br />
            <span className="text-angled">worked.</span>
          </h2>
        </div>

        {/* Experience cards */}
        <div className="mt-16 space-y-8">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className="reveal group relative"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Card */}
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-200/40 bg-white dark:bg-gray-100/60 p-8 sm:p-10 hover-lift">
                {/* Angled accent */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-ink/5 dark:bg-white/5 rounded-lg rotate-12 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Date badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-200/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>

                    {/* Title */}
                    <h3 className="mt-4 text-2xl sm:text-3xl font-bold">
                      {exp.role}
                    </h3>

                    {/* Company */}
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {exp.company}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
