import React from 'react';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { certifications } from '@/lib/data';

const Certifications: React.FC = () => {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {certifications.map((cert) => (
          <a
            key={cert.name}
            href={cert.url}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-card transition-all duration-350 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-card-hover"
          >
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-foreground" />
            <div>
              <p className="text-[15px] font-semibold leading-5 tracking-tight text-foreground">{cert.name}</p>
              <p className="mt-1 font-mono-label text-[11px] tracking-[0.5px] text-gray-500">{cert.issuer}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
