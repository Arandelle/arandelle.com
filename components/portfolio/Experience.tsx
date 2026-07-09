import React from 'react';
import { timeline } from '@/lib/data';

const Experience: React.FC = () => {
  return (
    <div>
      <ol className="relative space-y-7 border-l border-gray-200 pl-6">
        {timeline.map((item, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-background" />
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-foreground">{item.title}</p>
                <p className="font-mono-label text-[13px] text-gray-500">
                  {item.org}
                  {item.kind === 'education' && (
                    <span className="ml-2 rounded-full border border-gray-200 px-1.5 py-0.5 font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
                      Education
                    </span>
                  )}
                </p>
              </div>
              <span className="mt-0.5 font-mono-label text-[11px] uppercase tracking-[1px] text-gray-400 sm:mt-0">{item.period}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Experience;
