import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/data';

const Projects: React.FC = () => {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-card transition-all duration-350 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{project.name}</h3>
              <ArrowUpRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1.5 font-serif text-[14px] leading-6 text-gray-500">{project.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
