'use client';

import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { profile, socials } from '@/lib/data';
import { useReveal } from '@/lib/useReveal';

const ContactSection: React.FC = () => {
  const ref = useReveal();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 diagonal-stripes opacity-30" />

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
            07 — Contact
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Let's build
            <br />
            <span className="text-angled-reverse">together.</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mt-8 reveal" style={{ transitionDelay: '200ms' }}>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Have a project in mind or just want to connect? I'd love to hear from you.
          </p>
        </div>

        {/* CTA button */}
        <div className="mt-12 reveal" style={{ transitionDelay: '300ms' }}>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-3 rounded-full bg-ink text-background px-8 py-4 font-mono text-sm uppercase tracking-wider transition-all hover:scale-105"
          >
            <Mail className="h-5 w-5" />
            {profile.email}
          </a>
        </div>

        {/* Info row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 reveal" style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{profile.location}</span>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-12 flex items-center justify-center gap-6 reveal" style={{ transitionDelay: '500ms' }}>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 transition-all hover:border-ink dark:hover:border-gray-400 hover:scale-105"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-400 group-hover:text-ink dark:group-hover:text-white transition-colors">
                {social.label}
              </span>
              <ArrowIcon className="h-4 w-4 text-gray-400 group-hover:text-ink dark:group-hover:text-white transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 17L17 7M17 7H7M17 7v10"
    />
  </svg>
);

export default ContactSection;
