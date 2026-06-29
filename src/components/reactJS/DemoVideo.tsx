import React, { useState, useRef } from 'react';

interface DemoVideoProps {
  src: string;
  poster?: string;
  title?: string;
  description?: string;
  className?: string;
}

const DemoVideo: React.FC<DemoVideoProps> = ({
  src,
  poster,
  title,
  description,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`demo-video-container ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          onEnded={handleVideoEnd}
          onLoadedData={handleVideoLoad}
          preload="metadata"
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay */}
        <div 
          className="
            absolute inset-0 flex items-center justify-center 
            bg-black/20 opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 cursor-pointer
          "
          onClick={handlePlay}
        >
          <div className="
            bg-white/90 dark:bg-gray-800/90 rounded-full p-4 
            transform scale-100 hover:scale-110 transition-transform duration-200
          ">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg className="w-8 h-8 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gray-800 dark:text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Video Controls */}
        {isPlaying && (
          <div className="
            absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-2 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </button>
              
              <div className="flex-1 bg-white/30 rounded-full h-1">
                <div 
                  className="bg-white rounded-full h-1 transition-all duration-300"
                  style={{ 
                    width: videoRef.current 
                      ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
              
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.requestFullscreen?.();
                  }
                }}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Initial Play Button */}
        {!isPlaying && (
          <div 
            className="
              absolute inset-0 flex items-center justify-center 
              cursor-pointer
            "
            onClick={handlePlay}
          >
            <div className="
              bg-white/90 dark:bg-gray-800/90 rounded-full p-6 
              transform scale-100 hover:scale-110 transition-transform duration-200
              shadow-lg
            ">
              <svg className="w-12 h-12 text-gray-800 dark:text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoVideo;
