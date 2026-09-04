'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { profile, AVATAR_URL, socials } from '@/lib/data';

const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background diagonal stripes */}
      <div className="absolute inset-0 diagonal-stripes opacity-50" />

      {/* Large angled background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="display-text text-[20vw] text-gray-100 dark:text-gray-800/30 opacity-40 whitespace-nowrap">
          DEV
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Top label */}
        <div className="animate-fade-up" style={{ animationDelay: '50ms' }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Available for work
          </span>
        </div>

        {/* Main headline */}
        <div className="mt-8 animate-fade-up" style={{ animationDelay: '150ms' }}>
          <h1 className="display-text text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            <span className="block">Arandelle</span>
            <span className="block text-angled text-outline mt-2">
              Paguinto
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mt-8 animate-fade-up" style={{ animationDelay: '250ms' }}>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            {profile.role} crafting modern web experiences with precision and purpose.
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '350ms' }}>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-ink text-background px-6 py-3 font-mono text-[12px] uppercase tracking-wider transition-all hover:scale-105"
          >
            Get in touch
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 font-mono text-[12px] uppercase tracking-wider text-gray-600 dark:text-gray-400 transition-all hover:border-ink dark:hover:border-gray-400"
          >
            View work
          </a>
        </div>

        {/* Social links */}
        <div className="mt-16 flex items-center gap-6 animate-fade-up" style={{ animationDelay: '450ms' }}>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-wider text-gray-500 hover:text-ink dark:hover:text-gray-200 transition-colors"
            >
              {social.label} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-up" style={{ animationDelay: '600ms' }}>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 text-gray-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
