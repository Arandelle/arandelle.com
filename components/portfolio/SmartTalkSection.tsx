import React from 'react';
import { MessageSquare } from 'lucide-react';

const SmartTalkSection: React.FC = () => {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Smart Talk
        </h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 transition-colors duration-500">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This section is coming soon. Stay tuned for interactive conversations,
          Q&amp;A, and more.
        </p>
      </div>
    </div>
  );
};

export default SmartTalkSection;
