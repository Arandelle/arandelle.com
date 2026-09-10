'use client';

import React from 'react';
import { profile, AVATAR_URL } from '@/lib/data';
import { useReveal } from '@/lib/useReveal';
import AsciiPortrait from '@/components/portfolio/AsciiPortrait';

const AboutSection: React.FC = () => {
  const ref = useReveal();

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
            01 — About
          </span>
        </div>

        {/* Big intro text */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
            Building the web,{' '}
            <span className="text-angled text-outline">one pixel</span>{' '}
            at a time.
          </h2>
        </div>

        {/* Content grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Avatar + ASCII portrait + meta */}
          <div className="lg:col-span-4 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="sticky top-24 space-y-6">
              {/* Photo */}
              <div className="relative">
                <div className="absolute -inset-4 bg-ink/5 dark:bg-ink/10 rounded-2xl rotate-3" />
                <img
                  src={AVATAR_URL}
                  alt={profile.name}
                  className="relative w-full max-w-[280px] aspect-square object-cover rounded-2xl border border-gray-200 dark:border-gray-800"
                />
              </div>

              {/* ASCII portrait accent */}
              <div className="relative border border-gray-200 dark:border-gray-800 rounded-xl p-3 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <AsciiPortrait width={48} />
                <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-gray-400 text-center">
                  rendered in ascii
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    Name
                  </p>
                  <p className="text-lg font-semibold">{profile.name}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    Location
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {profile.location}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-200 underline decoration-gray-300 underline-offset-2"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio paragraphs */}
          <div className="lg:col-span-8 space-y-8">
            {profile.bioParagraphs.map((para, i) => (
              <div
                key={i}
                className="reveal"
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <p className="text-lg sm:text-xl leading-relaxed text-gray-700 dark:text-gray-300 font-serif">
                  {para}
                </p>
              </div>
            ))}

            {/* Stats */}
            <div
              className="reveal grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800"
              style={{ transitionDelay: '500ms' }}
            >
              <div>
                <p className="display-text text-3xl sm:text-4xl">1+</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  Years exp
                </p>
              </div>
              <div>
                <p className="display-text text-3xl sm:text-4xl">4+</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  Projects
                </p>
              </div>
              <div>
                <p className="display-text text-3xl sm:text-4xl">∞</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  Curiosity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
