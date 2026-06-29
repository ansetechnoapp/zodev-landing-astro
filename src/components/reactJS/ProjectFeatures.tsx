import React, { useState } from 'react';
import Modal from './Modal';

interface Feature {
  id: string;
  title: string;
  description: string;
  details: string;
  icon?: React.ReactNode;
  image?: string;
  technologies?: string[];
}

interface ProjectFeaturesProps {
  features: Feature[];
  className?: string;
}

const ProjectFeatures: React.FC<ProjectFeaturesProps> = ({ 
  features, 
  className = '' 
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const openModal = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <>
      <div className={`project-features ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="
                feature-card group bg-white dark:bg-gray-800 rounded-xl p-6 
                shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer
                border border-gray-200 dark:border-gray-700 hover:border-indigo-300
                dark:hover:border-indigo-600
              "
              onClick={() => openModal(feature)}
            >
              <div className="flex items-start gap-4">
                <div className="
                  flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30
                  rounded-lg flex items-center justify-center text-indigo-600
                  dark:text-indigo-400 group-hover:scale-110 transition-transform
                ">
                  {feature.icon || (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="
                    text-lg font-semibold text-gray-900 dark:text-white 
                    group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
                    transition-colors mb-2
                  ">
                    {feature.title}
                  </h3>
                  
                  <p className="
                    text-gray-600 dark:text-gray-300 text-sm leading-relaxed 
                    line-clamp-3
                  ">
                    {feature.description}
                  </p>
                  
                  <div className="
                    mt-4 flex items-center text-indigo-600 dark:text-indigo-400 
                    text-sm font-medium group-hover:gap-2 transition-all
                  ">
                    <span>Learn more</span>
                    <svg 
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Detail Modal */}
      <Modal
        isOpen={!!selectedFeature}
        onClose={closeModal}
        title={selectedFeature?.title || ''}
        size="lg"
      >
        {selectedFeature && (
          <div className="space-y-6">
            {selectedFeature.image && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedFeature.details}
              </p>
            </div>
            
            {selectedFeature.technologies && selectedFeature.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeature.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="
                        px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 
                        text-indigo-700 dark:text-indigo-300 text-sm 
                        rounded-full font-medium
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProjectFeatures;
