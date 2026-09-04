import React from 'react';
import { Wrench } from 'lucide-react';
import type { ExpertiseGroup } from '@/lib/data';

interface TechnicalExpertiseProps {
  expertise: ExpertiseGroup[];
}

const TechnicalExpertise: React.FC<TechnicalExpertiseProps> = ({
  expertise,
}) => {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-2">
        <Wrench className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Technical Expertise
        </h2>
      </div>

      <div className="space-y-6">
        {expertise.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-50">
              {group.heading}
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalExpertise;
