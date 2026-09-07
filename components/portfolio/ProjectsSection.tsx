'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string | null;
  tags: string[];
  featured: boolean;
}

const ProjectsSection: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const ref = useReveal();

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20 bg-ink text-background"
    >
      {/* Angled top edge */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-background transform -skew-y-2 origin-top-left" />
      </div>

      <div className="relative max-w-6xl mx-auto pt-16 pb-16">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
            04 — Projects
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Selected
            <br />
            <span className="text-angled">work.</span>
          </h2>
        </div>

        {/* Project grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group relative"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative h-full rounded-2xl border border-gray-800 bg-gray-900 p-8 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800">
                {/* Project number */}
                <span className="display-text text-8xl text-gray-800/50 absolute top-4 right-6">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-bold pr-8">
                    {project.name}
                  </h3>

                  <p className="mt-4 text-gray-400 leading-relaxed max-w-sm">
                    {project.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      View project
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
