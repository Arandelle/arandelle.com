'use client';

import React from 'react';
import { experiences, timeline } from '@/lib/data';
import { useReveal } from '@/lib/useReveal';

const ExperienceSection: React.FC = () => {
  const ref = useReveal();

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20 bg-gray-50 dark:bg-gray-900/50"
    >
      {/* Angled top edge */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
            02 — Experience
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Where I've
            <br />
            <span className="text-angled">worked.</span>
          </h2>
        </div>

        {/* Experience cards */}
        <div className="mt-16 space-y-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="reveal group relative"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Card */}
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-10 hover-lift">
                {/* Angled accent */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-ink dark:bg-gray-100 rounded-lg rotate-12 opacity-5 group-hover:opacity-10 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Date badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>

                    {/* Title */}
                    <h3 className="mt-4 text-2xl sm:text-3xl font-bold">
                      {exp.title}
                    </h3>

                    {/* Company */}
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {exp.company} · {exp.location}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>

                    {/* Tech stack */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {exp.isCurrent && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-green-700 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-20 reveal" style={{ transitionDelay: '300ms' }}>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-gray-400 mb-8">
            Progression
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-ink dark:border-gray-300 bg-background" />

                  <p className="font-semibold text-lg">{item.title}</p>
                  <p className="text-gray-600 dark:text-gray-400">{item.org}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                    {item.startDate} — {item.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
