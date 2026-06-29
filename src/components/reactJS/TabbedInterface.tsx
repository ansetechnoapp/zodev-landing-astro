import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({ 
  tabs, 
  defaultTab, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`tabbed-interface ${className}`}>
      {/* Tab Navigation */}
      <div className="tab-nav border-b border-gray-200 dark:border-gray-700 mb-6 relative">
        <nav className="tab-nav-container flex gap-4 md:gap-8 overflow-x-auto scroll-smooth pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-3 px-1 md:px-2 border-b-2 font-medium text-sm
                transition-colors duration-200 whitespace-nowrap min-h-[44px]
                flex-col md:flex-row text-center md:text-left
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
                }
              `}
            >
              {tab.icon && (
                <span className="w-4 h-4 flex-shrink-0">
                  {tab.icon}
                </span>
              )}
              <span className="text-xs md:text-sm leading-tight max-w-[80px] md:max-w-none">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Mobile scroll indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none md:hidden"></div>
        <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none md:hidden"></div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div
          className="animate-fade-in"
          key={activeTab}
        >
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};

export default TabbedInterface;
