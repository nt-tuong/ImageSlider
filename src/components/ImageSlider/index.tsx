import React, { useState, useRef, useEffect, useCallback } from "react";
// import "./index.css";
import NavigationArrowPrevious from "../NavigationArrowPrevious";
import NavigationArrowNext from "../NavigationArrowNext";

interface SliderProps {
  images: string[];
  isLoop?: boolean;
  autoPlay?: boolean;
  showNavigation?: boolean;
}

interface StateRef {
  currentIndex: number;
  imagesLength: number;
}

const Slider = ({
  images = [],
  isLoop = false,
  autoPlay = false,
  showNavigation = true,
}: SliderProps) => {
  const INITIAL_ZOOM = 100;
  const ZOOM_CLICK = 200;

  const [currentIndex, setCurrentIndex] = useState<number>(isLoop ? 1 : 0);
  const [startX, setStartX] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<StateRef>({
    currentIndex,
    imagesLength: images.length,
  });
  const isJumpingRef = useRef<boolean>(false);

  // Create slides array with clones for infinite loop
  const slides =
    isLoop && images.length > 0
      ? [images[images.length - 1], ...images, images[0]]
      : images;

  const realIndex =
    isLoop && images.length > 0
      ? currentIndex === 0
        ? images.length - 1
        : currentIndex === slides.length - 1
        ? 0
        : currentIndex - 1
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

  // Handle transition end - jump from clone slide to real slide (like CustomSlider)
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>): void => {
      // Only handle transform transitions
      if (e.propertyName !== "transform") return;

      if (
        !isLoop ||
        !contentRef.current ||
        images.length === 0 ||
        isJumpingRef.current
      ) {
        setIsTransitioning(false);
        return;
      }

      const totalSlides = images.length + 2;
      const content = contentRef.current;

      // If at clone slide, jump to real slide immediately (no transition, no delay)
      if (currentIndex === totalSlides - 1) {
        // At clone of first image, jump to real first image (index = 1)
        isJumpingRef.current = true;
        // Disable transition first
        content.style.transition = "none";
        // Update index immediately - this will trigger re-render
        setCurrentIndex(1);
        // Force synchronous reflow to apply the change immediately
        void content.offsetWidth;
        // Restore transition in next frame (async, but jump is already done)
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = "";
          }
          isJumpingRef.current = false;
        });
      } else if (currentIndex === 0) {
        // At clone of last image, jump to real last image (index = images.length)
        isJumpingRef.current = true;
        // Disable transition first
        content.style.transition = "none";
        // Update index immediately - this will trigger re-render
        setCurrentIndex(images.length);
        // Force synchronous reflow to apply the change immediately
        void content.offsetWidth;
        // Restore transition in next frame (async, but jump is already done)
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = "";
          }
          isJumpingRef.current = false;
        });
      }

      setIsTransitioning(false); // Stop transition immediately
    },
    [isLoop, currentIndex, images.length]
  );

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;
  // Swipe threshold as percentage of slide width (like react-slick, default 30%)
  const swipeThreshold = 0.3;

  const goToPrevious = (): void => {
    if (isTransitioning) return;
    if (isLoop && images.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      if (currentIndex > 0) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  const goToNext = (): void => {
    if (isTransitioning) return;
    if (isLoop && images.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      if (currentIndex < images.length - 1) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  // Touch Events
  const handleStart = (
    clientX: number,
    clientY: number | null = null
  ): void => {
    setStartX(clientX);
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
    const thresholdDistance = sliderWidth * swipeThreshold;

    if (isLoop && images.length > 0) {
      const totalSlides = images.length + 2;

      // React-slick style: check if swipe distance exceeds threshold
      const absOffset = Math.abs(offset);
      let newIndex = currentIndex;

      if (absOffset > thresholdDistance) {
        // Swipe is significant enough to change slide
        // offset = startX - clientX: positive when swiping left (next), negative when swiping right (prev)
        if (offset > 0) {
          // Swipe left -> next
          newIndex = currentIndex + 1;
        } else {
          // Swipe right -> prev
          newIndex = currentIndex - 1;
        }

        // Clamp to valid range (including clone slides)
        if (newIndex < 0) {
          newIndex = 0; // Clone of last image
        } else if (newIndex >= totalSlides) {
          newIndex = totalSlides - 1; // Clone of first image
        }
      }
      // If swipe is not significant, newIndex stays as currentIndex (snap back)

      // Update index (transition will be handled by onTransitionEnd)
      if (newIndex !== currentIndex) {
        // Normal slide change with transition (only if index changed)
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
      } else {
        // No change, just reset (snap back)
        setIsTransitioning(false);
      }
    } else {
      // Non-loop mode: respect bounds
      const isLeftSwipe = offset > minSwipeDistance;
      const isRightSwipe = offset < -minSwipeDistance;

      if (
        isLeftSwipe &&
        stateRef.current.currentIndex < stateRef.current.imagesLength - 1
      ) {
        setIsTransitioning(true);
        goToNext();
      } else if (isRightSwipe && stateRef.current.currentIndex > 0) {
        setIsTransitioning(true);
        goToPrevious();
      } else {
        // No change, just reset (snap back)
        setIsTransitioning(false);
      }
    }

    setStartX(null);
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
    handleMove(touch.clientX);
  };

  const onTouchEnd = (): void => {
    handleEnd();
  };

  const onTouchCancel = (): void => {
    setStartX(null);
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
      const thresholdDistance = sliderWidth * swipeThreshold;

      // Get current index from state ref to avoid dependency
      const currentIdx = currentIndex;

      if (isLoop && images.length > 0) {
        const totalSlides = images.length + 2;

        // React-slick style: check if swipe distance exceeds threshold
        const absOffset = Math.abs(offset);
        let newIndex = currentIdx;

        if (absOffset > thresholdDistance) {
          // Swipe is significant enough to change slide
          // offset = startX - clientX: positive when swiping left (next), negative when swiping right (prev)
          if (offset > 0) {
            // Swipe left -> next
            newIndex = currentIdx + 1;
          } else {
            // Swipe right -> prev
            newIndex = currentIdx - 1;
          }

          // Clamp to valid range (including clone slides)
          if (newIndex < 0) {
            newIndex = 0; // Clone of last image
          } else if (newIndex >= totalSlides) {
            newIndex = totalSlides - 1; // Clone of first image
          }
        }
        // If swipe is not significant, newIndex stays as currentIdx (snap back)

        // Update index (transition will be handled by onTransitionEnd)
        if (newIndex !== currentIdx) {
          // Normal slide change with transition (only if index changed)
          setIsTransitioning(true);
          setCurrentIndex(newIndex);
        } else {
          // No change, just reset (snap back)
          setIsTransitioning(false);
        }
      } else {
        // Non-loop mode: respect bounds
        const isLeftSwipe = offset > minSwipeDistance;
        const isRightSwipe = offset < -minSwipeDistance;

        if (
          isLeftSwipe &&
          stateRef.current.currentIndex < stateRef.current.imagesLength - 1
        ) {
          setIsTransitioning(true);
          setCurrentIndex((prev) =>
            Math.min(prev + 1, stateRef.current.imagesLength - 1)
          );
        } else if (isRightSwipe && stateRef.current.currentIndex > 0) {
          setIsTransitioning(true);
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        } else {
          // No change, just reset (snap back)
          setIsTransitioning(false);
        }
      }

      setStartX(null);
      setIsDragging(false);
      setOffset(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    startX,
    offset,
    isLoop,
    images.length,
    currentIndex,
    swipeThreshold,
  ]);

  if (!images || images.length === 0) {
    return (
      <div className="image-slider-container">
        <p>No images provided</p>
      </div>
    );
  }

  const getTransform = (): string => {
    const sliderWidth = sliderRef.current?.offsetWidth || 1;
    const baseTransform = -currentIndex * 100;
    const offsetPercent = isDragging ? (offset / sliderWidth) * 100 : 0;
    // offset = startX - clientX: positive when swiping left, negative when swiping right
    // To move slide in drag direction, subtract offset
    return `translateX(calc(${baseTransform}% - ${offsetPercent}%))`;
  };

  return (
    <div className="image-slider-container">
      <div
        className={`image-slider-wrapper ${
          isTransitioning ? "transitioning" : ""
        }`}
        ref={sliderRef}
        style={{
          cursor: isTransitioning ? "default" : undefined,
        }}
        {...(!isTransitioning && {
          onTouchStart: onTouchStart,
          onTouchMove: onTouchMove,
          onTouchEnd: onTouchEnd,
          onTouchCancel: onTouchCancel,
          onMouseDown: onMouseDown,
        })}
      >
        <div
          ref={contentRef}
          className="image-slider-content"
          style={{
            transform: getTransform(),
            transition:
              isTransitioning && !isDragging
                ? "transform 0.5s ease-in-out"
                : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((image, index) => (
            <div key={`${isLoop ? "loop-" : ""}${index}`} className="slide">
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
              disabled={(!isLoop && realIndex === 0) || isTransitioning}
            />
            <NavigationArrowNext
              onClick={goToNext}
              disabled={
                (!isLoop && realIndex === images.length - 1) || isTransitioning
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;
