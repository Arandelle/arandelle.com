'use client';

import React from 'react';
import { useReveal } from '@/lib/useReveal';

interface Expertise {
  id: string;
  name: string;
  skills: string[];
  order: number;
}

const ExpertiseSection: React.FC<{ expertise: Expertise[] }> = ({ expertise }) => {
  const ref = useReveal();

  return (
    <section
      id="expertise"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background big text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05]">
        <span className="display-text text-[25vw] whitespace-nowrap">
          SKILLS
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
            03 — Expertise
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            What I
            <br />
            <span className="text-angled-reverse">bring.</span>
          </h2>
        </div>

        {/* Skills grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertise.map((group, i) => (
            <div
              key={group.id}
              className="reveal"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover-lift">
                {/* Number */}
                <span className="display-text text-6xl text-gray-100 dark:text-gray-800 absolute top-4 right-4">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="text-xl font-bold mb-6">{group.name}</h3>

                <ul className="space-y-3">
                  {group.skills.map((skill, si) => (
                    <li
                      key={si}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                    >
                      <span className="h-1 w-1 rounded-full bg-ink dark:bg-gray-400" />
                      <span className="text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee skills */}
        <div className="mt-20 reveal overflow-hidden" style={{ transitionDelay: '500ms' }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-8 pr-8">
                {expertise.flatMap((g) => g.skills).map((skill, i) => (
                  <span
                    key={`${setIndex}-${i}`}
                    className="display-text text-3xl sm:text-4xl md:text-5xl text-gray-200 dark:text-gray-800"
                  >
                    {skill}
                    <span className="mx-4 text-gray-300 dark:text-gray-700">&bull;</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
