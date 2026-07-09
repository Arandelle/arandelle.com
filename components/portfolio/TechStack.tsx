import React from 'react';
import { techStack } from '@/lib/data';

const TechStack: React.FC = () => {
  return (
    <div>
      <div className="space-y-6">
        {techStack.map((group) => (
          <div key={group.category}>
            <p className="mb-2.5 font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gray-200 px-3 py-1 font-mono-label text-[11px] tracking-[0.5px] text-gray-500 transition-colors hover:border-foreground hover:text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
