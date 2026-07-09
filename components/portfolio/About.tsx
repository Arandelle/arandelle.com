import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { profile, AVATAR_URL } from '@/lib/data';

const About: React.FC = () => {
  return (
    <div>
      <div className="space-y-4 font-serif text-[17px] leading-[1.75] text-gray-500">
        {profile.bioParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Guild membership card */}
      {/* <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-[15px] font-semibold tracking-tight text-foreground">Member · Engineering Guild</p>
            <p className="font-mono-label text-[11px] uppercase tracking-[1px] text-gray-400">Verified since 2019</p>
          </div>
        </div>
        <span className="font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">EG-0482</span>
      </div> */}

      {/* Roles */}
      <div className="mt-6 flex flex-wrap gap-2">
        {profile.roles.map((role) => (
          <span
            key={role}
            className="rounded-full border border-gray-200 px-3 py-1 font-mono-label text-[11px] uppercase tracking-[1px] text-gray-500"
          >
            {role}
          </span>
        ))}
      </div>

      {/* Featured badge — inverted chip */}
      <a
        href={profile.featured.href}
        target='_blank'
        className="group mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[1px] text-background transition-colors hover:opacity-90"
      >
        {profile.featured.label}
      </a>

      {/* Avatar */}
      <div className="mt-8">
        <img
          src={AVATAR_URL}
          alt={profile.name}
          className="h-20 w-20 rounded-full border border-gray-200 object-cover"
        />
      </div>
    </div>
  );
};

export default About;
