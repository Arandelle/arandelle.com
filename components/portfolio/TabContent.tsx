'use client'

import React, { useState } from 'react';
import type { TabId } from './Sidebar';
import type { Article } from '@/lib/data';
import About from './About';
import Experience from './Experience';
import TechStack from './TechStack';
import Projects from './Projects';
import Certifications from './Certifications';
import Blog from './Blog';
import ArticleDetail from './ArticleDetail';
import Testimonials from './Testimonials';

interface TabContentProps {
  activeTab: TabId;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const sectionNumbers: Record<TabId, string> = {
    about: '01 —',
    experience: '02 —',
    stack: '03 —',
    projects: '04 —',
    certifications: '05 —',
    writing: '06 —',
    recommendations: '07 —',
  };

  const sectionHeadings: Record<TabId, string> = {
    about: 'about',
    experience: 'experience',
    stack: 'stack',
    projects: 'projects',
    certifications: 'certifications',
    writing: 'writing',
    recommendations: 'recommendations',
  };

  const renderTab = () => {
    if (activeTab === 'writing' && activeArticle) {
      return (
        <ArticleDetail article={activeArticle} onBack={() => setActiveArticle(null)} />
      );
    }

    switch (activeTab) {
      case 'about':
        return <About />;
      case 'experience':
        return <Experience />;
      case 'stack':
        return <TechStack />;
      case 'projects':
        return <Projects />;
      case 'certifications':
        return <Certifications />;
      case 'writing':
        return <Blog onSelect={setActiveArticle} />;
      case 'recommendations':
        return <Testimonials />;
      default:
        return <About />;
    }
  };

  return (
    <div className="animate-enter-up">
      {/* Section header */}
      {!(activeTab === 'writing' && activeArticle) && (
        <div className="mb-6 border-b border-gray-200 pb-3">
          <h2 className="flex items-baseline gap-2">
            <span className="font-pixel text-[12px] lowercase tracking-tight text-gray-400">
              {sectionNumbers[activeTab]}
            </span>
            <span className="font-pixel text-[1.5rem] leading-none lowercase tracking-tight text-foreground">
              {sectionHeadings[activeTab]}
            </span>
          </h2>
        </div>
      )}
      {renderTab()}
    </div>
  );
};

export default TabContent;
