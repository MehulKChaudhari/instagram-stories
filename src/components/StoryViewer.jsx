import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StoryViewer.css';

function StoryViewer({ user, stories, currentStoryId, isUserTransition = false, hasOpenedBefore = false, onClose, onNext, onPrevious, onNextUser, onPreviousUser, onUserTransitionComplete, onFirstOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const prevIndexRef = useRef(0);
  const prevUserIdRef = useRef(null);
  const transitionDirectionRef = useRef(0);

  useEffect(() => {
    const index = stories.findIndex((s) => s.id === currentStoryId);
    if (index !== -1) {
      const userChanged = prevUserIdRef.current !== null && prevUserIdRef.current !== user.id;
      
      if (index !== prevIndexRef.current || userChanged) {
        let newDirection = 0;
        if (userChanged) {
          newDirection = transitionDirectionRef.current;
          transitionDirectionRef.current = 0;
        } else {
          newDirection = index > prevIndexRef.current ? 1 : -1;
        }
        setDirection(newDirection);
        setCurrentIndex(index);
        prevIndexRef.current = index;
        setIsLoading(true);
        setProgress(0);
        isNavigatingRef.current = false;
      }
      
      prevUserIdRef.current = user.id;
      
      if (isUserTransition || hasOpenedBefore || userChanged) {
        setIsFirstRender(false);
      } else if (isFirstRender && onFirstOpen) {
        setIsFirstRender(false);
        onFirstOpen();
      }
    }
  }, [currentStoryId, stories, user.id, isFirstRender, isUserTransition, hasOpenedBefore, onFirstOpen]);

  useEffect(() => {
    stories.forEach((story) => {
      if (!loadedImages.has(story.imageUrl)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, story.imageUrl]));
        };
        img.src = story.imageUrl;
      }
    });
  }, [stories, loadedImages]);

  useEffect(() => {
    const currentStory = stories[currentIndex];
    if (!currentStory) return;

    const isImageLoaded = loadedImages.has(currentStory.imageUrl);
    setIsLoading(!isImageLoaded);
    
    if (isImageLoaded) {
      setProgress(0);
    } else {
    const img = new Image();
    img.onload = () => {
      setLoadedImages((prev) => new Set([...prev, currentStory.imageUrl]));
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
    }
  }, [currentIndex, stories, loadedImages]);

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
    setDirection(1);
    transitionDirectionRef.current = 1;
    clearTimers();
    onNext();
  };

  const handlePrevious = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setDirection(-1);
    transitionDirectionRef.current = -1;
    clearTimers();
    onPrevious();
  };

  useEffect(() => {
    if (isUserTransition) {
      const timer = setTimeout(() => {
        if (onUserTransitionComplete) {
          onUserTransitionComplete();
        }
      }, 450);
      
      return () => clearTimeout(timer);
    }
  }, [isUserTransition, onUserTransitionComplete]);

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

  const handleClick = (e) => {
    if (isNavigatingRef.current) return;
    
    e.stopPropagation();
    const leftHalf = window.innerWidth / 2;

    if (e.clientX < leftHalf) {
      currentIndex === 0 ? onPreviousUser() : handlePrevious();
    } else {
      currentIndex === stories.length - 1 ? onNextUser() : handleNext();
    }
  };

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;

  const storyVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
      },
    }),
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0.3 : 0,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: isUserTransition ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0.4 : 0,
        delay: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0.1 : 0,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className="story-viewer"
      onClick={handleClick}
      variants={containerVariants}
      initial={hasOpenedBefore || isUserTransition ? "animate" : "initial"}
      animate="animate"
      exit="exit"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentStory.id}
          className="story-content"
          custom={direction}
          variants={storyVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 400, damping: 35 },
          }}
        >
          {isLoading && !loadedImages.has(currentStory.imageUrl) && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          <img
            src={currentStory.imageUrl}
            alt={`Story ${currentStory.id}`}
            className="story-image"
            style={{
              opacity: isLoading && !loadedImages.has(currentStory.imageUrl) ? 0.3 : 1,
              transition: 'opacity 0.2s ease',
            }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="story-header"
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="user-info">
          <motion.img
            src={user.avatar}
            alt={user.username}
            className="user-avatar"
            initial={{ scale: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0 : 1 }}
            animate={{ scale: 1 }}
            transition={(isFirstRender && !hasOpenedBefore && !isUserTransition) ? { delay: 0.2, type: 'spring', stiffness: 200, damping: 15 } : { duration: 0 }}
          />
          <motion.span
            className="user-name"
            initial={{ opacity: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0 : 1, x: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? -10 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={(isFirstRender && !hasOpenedBefore && !isUserTransition) ? { delay: 0.25, duration: 0.3 } : { duration: 0 }}
          >
            {user.username}
          </motion.span>
        </div>
        <div className="progress-bars">
          {stories.map((_, index) => (
            <div key={index} className="progress-bar-container">
              <motion.div
                className={`progress-bar ${index < currentIndex ? 'completed' : ''}`}
                initial={{ width: index < currentIndex ? '100%' : '0%' }}
                animate={{
                  width:
                    index === currentIndex
                      ? `${progress}%`
                      : index < currentIndex
                      ? '100%'
                      : '0%',
                }}
                transition={{
                  width: { duration: 0.1, ease: 'linear' },
                }}
              />
            </div>
          ))}
        </div>
        <motion.button
          className="close-btn"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose(); }}
          initial={{ scale: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? 0 : 1, rotate: (isFirstRender && !hasOpenedBefore && !isUserTransition) ? -90 : 0 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={(isFirstRender && !hasOpenedBefore && !isUserTransition) ? {
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.3,
          } : { duration: 0 }}
        >
          ×
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default StoryViewer;

