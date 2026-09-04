'use client';

import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

const FloatingNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      const sectionElements = sections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i].el;
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sectionElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{ bottom: '2rem' }}
    >
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-2 py-2 shadow-lg backdrop-blur-md dark:border-gray-200/40 dark:bg-gray-100/80 max-w-[calc(100vw-2rem)] overflow-x-auto scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`rounded-full px-3 py-2 sm:px-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeSection === section.id
                ? 'bg-ink text-background'
                : 'text-gray-500 hover:text-ink dark:hover:text-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default FloatingNav;
