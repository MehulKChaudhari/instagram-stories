import { useState, useEffect, useRef } from 'react';
import './StoryViewer.css';

function StoryViewer({ stories, currentStoryId, onClose, onNext, onPrevious }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const index = stories.findIndex((s) => s.id === currentStoryId);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsLoading(true);
      setProgress(0);
      isNavigatingRef.current = false;
    }
  }, [currentStoryId, stories]);

  useEffect(() => {
    const currentStory = stories[currentIndex];
    if (!currentStory) return;

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setProgress(0);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = currentStory.imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentIndex, stories]);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleNext = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    clearTimers();
    onNext();
  };

  const handlePrevious = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    clearTimers();
    onPrevious();
  };

  useEffect(() => {
    if (isLoading || isNavigatingRef.current) return;

    clearTimers();

    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    intervalRef.current = setTimeout(() => {
      if (!isNavigatingRef.current) {
        onNext();
      }
    }, 5000);

    return () => {
      clearTimers();
    };
  }, [currentIndex, isLoading, onNext]);

  const handleNavigation = (clientX) => {
    const screenWidth = window.innerWidth;
    const leftHalf = screenWidth / 2;
    if (clientX < leftHalf) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleClick = (e) => {
    if (isNavigatingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    if (e.clientX) {
      handleNavigation(e.clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (isNavigatingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const touch = e.changedTouches?.[0];
    if (touch?.clientX) {
      handleNavigation(touch.clientX);
    }
  };

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;

  return (
    <div className="story-viewer" onClick={handleClick} onTouchEnd={handleTouchEnd}>
      <div className="story-header">
        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          ×
        </button>
        <div className="progress-bars">
          {stories.map((_, index) => (
            <div key={index} className="progress-bar-container">
              <div
                className={`progress-bar ${
                  index === currentIndex ? 'active' : ''
                } ${index < currentIndex ? 'completed' : ''}`}
                style={{
                  width:
                    index === currentIndex
                      ? `${progress}%`
                      : index < currentIndex
                      ? '100%'
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="story-content">
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <img
          src={currentStory.imageUrl}
          alt={`Story ${currentStory.id}`}
          className={`story-image ${isLoading ? 'loading' : ''}`}
        />
      </div>
    </div>
  );
}

export default StoryViewer;

