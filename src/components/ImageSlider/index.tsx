import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import NavigationArrowPrevious from '../NavigationArrowPrevious';
import NavigationArrowNext from '../NavigationArrowNext';

interface ImageSliderProps {
  images: string[];
  loop?: boolean;
}

interface StateRef {
  currentIndex: number;
  imagesLength: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images = [], loop = false }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(loop ? 1 : 0);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<StateRef>({ currentIndex, imagesLength: images.length });

  // Create slides array with clones for infinite loop
  const slides = loop && images.length > 0 
    ? [images[images.length - 1], ...images, images[0]]
    : images;
  
  const realIndex = loop && images.length > 0
    ? currentIndex === 0 ? images.length - 1 : currentIndex === slides.length - 1 ? 0 : currentIndex - 1
    : currentIndex;

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = { currentIndex: realIndex, imagesLength: images.length };
  }, [currentIndex, images.length, realIndex]);

  // Reset index when loop changes
  useEffect(() => {
    if (loop && images.length > 0) {
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
  }, [loop, images.length]);

  // Handle infinite loop jump (when loop is enabled)
  useEffect(() => {
    if (!loop || !contentRef.current || images.length === 0) return;

    const handleTransitionEnd = (): void => {
      if (!isTransitioning) return;
      
      setIsTransitioning(false);
      
      const totalSlides = images.length + 2; // original + 2 clones
      
      // Jump to real slide without transition
      if (currentIndex === 0) {
        // At clone of last image, jump to real last image (index = images.length)
        contentRef.current!.style.transition = 'none';
        setCurrentIndex(images.length);
        // Force reflow
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = '';
          }
        });
      } else if (currentIndex === totalSlides - 1) {
        // At clone of first image, jump to real first image (index = 1)
        contentRef.current!.style.transition = 'none';
        setCurrentIndex(1);
        // Force reflow
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = '';
          }
        });
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('transitionend', handleTransitionEnd);
      return () => {
        content.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [loop, currentIndex, images.length, isTransitioning]);

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;

  const goToPrevious = (): void => {
    if (loop && images.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  const goToNext = (): void => {
    if (loop && images.length > 0) {
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

    const isLeftSwipe = offset > minSwipeDistance;
    const isRightSwipe = offset < -minSwipeDistance;

    if (loop && images.length > 0) {
      if (isLeftSwipe) {
        setIsTransitioning(true);
        goToNext();
      } else if (isRightSwipe) {
        setIsTransitioning(true);
        goToPrevious();
      }
    } else {
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
      e.preventDefault();
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

      const currentOffset = offset;
      const isLeftSwipe = currentOffset > minSwipeDistance;
      const isRightSwipe = currentOffset < -minSwipeDistance;

      if (loop && images.length > 0) {
        setIsTransitioning(true);
        if (isLeftSwipe) {
          setCurrentIndex((prev) => prev + 1);
        } else if (isRightSwipe) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else {
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
  }, [isDragging, startX, offset, loop, images.length]);

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
            <div key={`${loop ? 'loop-' : ''}${index}`} className="slide">
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
        {images.length > 1 && (
          <>
            <NavigationArrowPrevious 
              onClick={goToPrevious} 
              disabled={!loop && realIndex === 0}
            />
            <NavigationArrowNext 
              onClick={goToNext} 
              disabled={!loop && realIndex === images.length - 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;

