import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';
import NavigationArrowPrevious from '../NavigationArrowPrevious';
import NavigationArrowNext from '../NavigationArrowNext';

interface ImageSliderProps {
  images: string[];
  isLoop?: boolean;
  autoPlay?: boolean;
  showNavigation?: boolean;
}

interface StateRef {
  currentIndex: number;
  imagesLength: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images = [], isLoop = false, autoPlay = false, showNavigation = true }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(isLoop ? 1 : 0);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<StateRef>({ currentIndex, imagesLength: images.length });
  const isJumpingRef = useRef<boolean>(false);

  // Create slides array with clones for infinite loop
  const slides = isLoop && images.length > 0 
    ? [images[images.length - 1], ...images, images[0]]
    : images;
  
  const realIndex = isLoop && images.length > 0
    ? currentIndex === 0 ? images.length - 1 : currentIndex === slides.length - 1 ? 0 : currentIndex - 1
    : currentIndex;

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = { currentIndex: realIndex, imagesLength: images.length };
  }, [currentIndex, images.length, realIndex]);

  // Reset index when loop changes
  useEffect(() => {
    if (isLoop && images.length > 0) {
      // Start at index 1 (first real image) when loop is enabled
      setCurrentIndex((prev) => {
        if (prev === 0 || prev >= images.length + 2) {
          return 1;
        }
        return prev;
      });
    } else {
      // Reset to valid index when loop is disabled
      setCurrentIndex((prev) => {
        if (prev >= images.length) {
          return Math.min(prev, images.length - 1);
        }
        return prev;
      });
    }
  }, [isLoop, images.length]);

  // Helper function to jump from clone slide to real slide (no transition)
  const jumpToRealSlide = useCallback((targetIndex: number): void => {
    if (!contentRef.current || isJumpingRef.current) return;
    
    isJumpingRef.current = true;
    const content = contentRef.current;
    
    // Disable transition for jump
    content.style.transition = 'none';
    setCurrentIndex(targetIndex);
    
    // Force reflow
    void content.offsetWidth;
    
    // Restore transition in next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = '';
        }
        isJumpingRef.current = false;
        setIsTransitioning(false);
      });
    });
  }, []);

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;

  const goToPrevious = (): void => {
    if (isLoop && images.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  const goToNext = (): void => {
    if (isLoop && images.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      if (currentIndex < images.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  // Touch Events
  const handleStart = (clientX: number, clientY: number | null = null): void => {
    setStartX(clientX);
    setStartY(clientY);
    setIsDragging(true);
    setOffset(0);
  };

  const handleMove = (clientX: number): void => {
    if (startX === null || !isDragging) return;
    
    const diff = startX - clientX;
    setOffset(diff);
  };

  const handleEnd = (): void => {
    if (startX === null) return;

    const sliderWidth = sliderRef.current?.offsetWidth || 1;
    
    if (isLoop && images.length > 0) {
      const totalSlides = images.length + 2;
      // Calculate how many slides to move based on offset
      // Allow free dragging - calculate based on actual offset
      // offset = startX - clientX: positive when swiping left (next), negative when swiping right (prev)
      const slidesToMove = Math.round(offset / sliderWidth);
      let newIndex = currentIndex + slidesToMove;
      
      // Clamp to valid range (including clone slides)
      if (newIndex < 0) {
        newIndex = 0; // Clone of last image
      } else if (newIndex >= totalSlides) {
        newIndex = totalSlides - 1; // Clone of first image
      }
      
      // Check if we need to jump from clone to real slide
      if (newIndex === 0) {
        // Jump to real last image (index = images.length)
        jumpToRealSlide(images.length);
      } else if (newIndex === totalSlides - 1) {
        // Jump to real first image (index = 1)
        jumpToRealSlide(1);
      } else if (newIndex !== currentIndex) {
        // Normal slide change with transition (only if index changed)
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
      } else {
        // No change, just reset
        setIsTransitioning(false);
      }
    } else {
      // Non-loop mode: respect bounds
      const isLeftSwipe = offset > minSwipeDistance;
      const isRightSwipe = offset < -minSwipeDistance;
      
      if (isLeftSwipe && stateRef.current.currentIndex < stateRef.current.imagesLength - 1) {
        goToNext();
      } else if (isRightSwipe && stateRef.current.currentIndex > 0) {
        goToPrevious();
      }
    }

    setStartX(null);
    setStartY(null);
    setIsDragging(false);
    setOffset(0);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (startX === null || !isDragging) return;
    
    const touch = e.touches[0];
    const diffX = Math.abs(startX - touch.clientX);
    const diffY = startY !== null ? Math.abs(startY - touch.clientY) : 0;
    
    // Only prevent default if horizontal movement is greater than vertical (swipe horizontally)
    // This allows vertical scrolling while enabling horizontal swiping
    if (diffX > diffY && diffX > 10) {
      try {
        e.preventDefault();
      } catch { /* Do nothing */}
    }
    
    handleMove(touch.clientX);
  };

  const onTouchEnd = (): void => {
    handleEnd();
  };

  const onTouchCancel = (): void => {
    setStartX(null);
    setStartY(null);
    setIsDragging(false);
    setOffset(0);
  };

  // Mouse Events (for desktop drag)
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Add document-level mouse event listeners
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent): void => {
      if (startX === null) return;
      const diff = startX - e.clientX;
      setOffset(diff);
    };

    const handleMouseUp = (): void => {
      if (startX === null) return;

      const sliderWidth = sliderRef.current?.offsetWidth || 1;
      
      // Get current index from state ref to avoid dependency
      const currentIdx = currentIndex;
      
      if (isLoop && images.length > 0) {
        const totalSlides = images.length + 2;
        // Calculate how many slides to move based on offset
        // Allow free dragging - calculate based on actual offset
        // offset = startX - clientX: positive when swiping left (next), negative when swiping right (prev)
        const slidesToMove = Math.round(offset / sliderWidth);
        let newIndex = currentIdx + slidesToMove;
        
        // Clamp to valid range (including clone slides)
        if (newIndex < 0) {
          newIndex = 0; // Clone of last image
        } else if (newIndex >= totalSlides) {
          newIndex = totalSlides - 1; // Clone of first image
        }
        
        // Check if we need to jump from clone to real slide
        if (newIndex === 0) {
          // Jump to real last image (index = images.length)
          jumpToRealSlide(images.length);
        } else if (newIndex === totalSlides - 1) {
          // Jump to real first image (index = 1)
          jumpToRealSlide(1);
        } else if (newIndex !== currentIdx) {
          // Normal slide change with transition (only if index changed)
          setIsTransitioning(true);
          setCurrentIndex(newIndex);
        } else {
          // No change, just reset
          setIsTransitioning(false);
        }
      } else {
        // Non-loop mode: respect bounds
        const isLeftSwipe = offset > minSwipeDistance;
        const isRightSwipe = offset < -minSwipeDistance;
        
        if (isLeftSwipe && stateRef.current.currentIndex < stateRef.current.imagesLength - 1) {
          setCurrentIndex((prev) => Math.min(prev + 1, stateRef.current.imagesLength - 1));
        } else if (isRightSwipe && stateRef.current.currentIndex > 0) {
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
      }

      setStartX(null);
      setStartY(null);
      setIsDragging(false);
      setOffset(0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, offset, isLoop, images.length, currentIndex, jumpToRealSlide]);

  if (!images || images.length === 0) {
    return (
      <div className="image-slider-container">
        <p>No images provided</p>
      </div>
    );
  }

  const getTransform = (): string => {
    const baseTransform = -currentIndex * 100;
    const sliderWidth = sliderRef.current?.offsetWidth || 1;
    const offsetPercent = (offset / sliderWidth) * 100;
    return `translateX(calc(${baseTransform}% - ${offsetPercent}px))`;
  };

  return (
    <div className="image-slider-container">
      <div 
        className="image-slider-wrapper"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onMouseDown={onMouseDown}
        ref={sliderRef}
      >
        <div 
          ref={contentRef}
          className="image-slider-content"
          style={{ 
            transform: getTransform(),
            transition: !isDragging && !isTransitioning 
              ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
              : isDragging 
                ? 'none' 
                : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {slides.map((image, index) => (
            <div key={`${isLoop ? 'loop-' : ''}${index}`} className="slide">
              <img 
                src={image} 
                alt={`Slide ${index + 1}`}
                className="slide-image"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && showNavigation && (
          <>
            <NavigationArrowPrevious 
              onClick={goToPrevious} 
              disabled={!isLoop && realIndex === 0}
            />
            <NavigationArrowNext 
              onClick={goToNext} 
              disabled={!isLoop && realIndex === images.length - 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;

