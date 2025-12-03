import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.css";
import NavigationArrowPrevious from "../NavigationArrowPrevious";
import NavigationArrowNext from "../NavigationArrowNext";

interface SliderProps {
  images: string[];
  isLoop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number; // in milliseconds, default 3000
  showNavigation?: boolean;
}

interface StateRef {
  currentIndex: number;
  imagesLength: number;
}

const TRANSITION_DURATION = 500;
const INITIAL_ZOOM = 100;
const ZOOM_CLICK = 200;

// Minimum swipe distance (in pixels) to trigger slide change
const MIN_SWIPE_DISTANCE = 50;
// Swipe threshold as percentage of slide width (like react-slick, default 30%)
const SWIPE_THRESHOLD = 0.3;
// Zoom moving duration (in milliseconds)
const ZOOM_MOVING_DURATION = 200;

const Slider = ({
  images = [],
  isLoop = false,
  autoPlay = false,
  autoPlayInterval = 3000, // default 3 seconds
  showNavigation = true,
}: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(isLoop ? 1 : 0);
  const [startX, setStartX] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isTransitioningAfterSnapBack, setIsTransitioningAfterSnapBack] =
    useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<StateRef>({
    currentIndex,
    imagesLength: images.length,
  });
  const isJumpingRef = useRef<boolean>(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetMouseMoveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseMoveRef = useRef<boolean>(false);

  // Zoom in/out image position
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [imagePosition, setImagePosition] = React.useState({ x: 0, y: 0 });
  const [isZoomDragging, setIsZoomDragging] = useState<boolean>(false);
  const [zoomDragStart, setZoomDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const isZoomMovingRef = useRef<boolean>(false);
  const zoomingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // AutoPlay functionality
  useEffect(() => {
    // Clear existing timer
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // Don't start autoPlay if:
    // - autoPlay is disabled
    // - no images or only one image
    // - is paused
    // - is transitioning
    // - is dragging
    // - is zoomed
    if (
      !autoPlay ||
      images.length <= 1 ||
      isPaused ||
      isTransitioning ||
      isDragging ||
      zoom > INITIAL_ZOOM
    ) {
      return;
    }

    // Start autoPlay timer
    autoPlayTimerRef.current = setInterval(() => {
      // Check again before auto-advancing
      if (isPaused || isTransitioning || isDragging || zoom > INITIAL_ZOOM) {
        return;
      }

      // Auto-advance to next slide
      if (isLoop && images.length > 0) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => {
          const totalSlides = images.length + 2;
          const nextIndex = prevIndex + 1;
          return nextIndex >= totalSlides ? 0 : nextIndex;
        });
      } else {
        // Non-loop mode: go to next, or loop back to start if at end
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => {
          if (prevIndex < images.length - 1) {
            return prevIndex + 1;
          } else {
            // At the end, loop back to start if autoPlay is enabled
            return 0;
          }
        });
      }
    }, autoPlayInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [
    autoPlay,
    autoPlayInterval,
    images.length,
    isLoop,
    isPaused,
    isTransitioning,
    isDragging,
    zoom,
  ]);

  // Pause autoPlay temporarily
  const pauseAutoPlayTemporarily = useCallback(() => {
    // Do nothing if autoPlay is disabled
    if (!autoPlay) return;

    // Pause autoPlay
    setIsPaused(true);

    // Clear existing timeout to prevent multiple timeouts
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    // Set new timeout to resume autoPlay after a delay
    resumeTimerRef.current = setTimeout(
      () => setIsPaused(false),
      autoPlayInterval * 2
    );
  }, [autoPlay, autoPlayInterval]);

  // Pause autoPlay on hover
  const handleMouseEnter = (): void => {
    if (autoPlay) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = (): void => {
    if (autoPlay) {
      setIsPaused(false);
    }
  };

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

  const goToPrevious = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (isTransitioning || zoom > INITIAL_ZOOM) return;
    e.preventDefault();
    e.stopPropagation();

    pauseAutoPlayTemporarily();

    // Go to previous slide
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

  const goToNext = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (isTransitioning || zoom > INITIAL_ZOOM) return;
    e.preventDefault();
    e.stopPropagation();

    pauseAutoPlayTemporarily();

    // Go to next slide
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

  const handleTransitionAfterSnapBack = (): void => {
    // No change, just reset (snap back)
    setIsTransitioning(false);

    // Reset transition state after snap back animation completes
    setIsTransitioningAfterSnapBack(true);
  };

  const resetMouseMoveFlag = () => {
    // Clear existing timeout to prevent multiple timeouts
    if (resetMouseMoveTimerRef.current)
      clearTimeout(resetMouseMoveTimerRef.current);

    // Set new timeout to reset mouse move flag
    resetMouseMoveTimerRef.current = setTimeout(() => {
      setIsTransitioningAfterSnapBack(false);

      // Reset mouse move flag
      isMouseMoveRef.current = false;
    }, TRANSITION_DURATION); // Match transition duration (0.5s)
  };

  const processSwipe = () => {
    const sliderWidth = sliderRef.current?.offsetWidth || 1;
    const thresholdDistance = sliderWidth * SWIPE_THRESHOLD;

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
        handleTransitionAfterSnapBack();
      }
    } else {
      // Non-loop mode: respect bounds
      const isLeftSwipe = offset > MIN_SWIPE_DISTANCE;
      const isRightSwipe = offset < -MIN_SWIPE_DISTANCE;

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
        handleTransitionAfterSnapBack();
      }
    }

    setStartX(null);
    setIsDragging(false);
    setOffset(0);

    // Reset mouse move flag
    resetMouseMoveFlag();
  };

  // Touch Events
  const handleStart = (clientX: number): void => {
    // Don't allow swipe when zoomed
    if (zoom > INITIAL_ZOOM) return;

    // Pause autoPlay when user starts dragging
    if (autoPlay) {
      setIsPaused(true);
    }
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

    // Resume autoPlay after user finishes dragging (with delay)
    if (autoPlay) {
      setTimeout(() => {
        setIsPaused(false);
      }, autoPlayInterval);
    }

    processSwipe();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    // Don't allow swipe when zoomed
    if (zoom > INITIAL_ZOOM) return;
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    // Don't allow swipe when zoomed
    if (zoom > INITIAL_ZOOM) return;
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
    // Don't allow swipe when zoomed
    if (zoom > INITIAL_ZOOM) return;

    e.preventDefault();
    handleStart(e.clientX);
  };

  // Add document-level mouse event listeners for swipe
  useEffect(() => {
    if (!isDragging || zoom > INITIAL_ZOOM) return;

    const handleMouseMove = (e: MouseEvent): void => {
      if (startX === null) return;

      // Case: If mouse is moving, set the flag to true → not click
      isMouseMoveRef.current = true;

      const diff = startX - e.clientX;
      setOffset(diff);
    };

    const handleMouseUp = (): void => {
      if (startX === null) return;

      processSwipe();
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
    SWIPE_THRESHOLD,
    zoom,
  ]);

  const processZoomSwipe = (clientX: number, clientY: number): void => {
    if (!isZoomDragging || zoom <= INITIAL_ZOOM) return;

    // Set zoom moving flag to true
    isZoomMovingRef.current = true;

    const newX = clientX - zoomDragStart.x;
    const newY = clientY - zoomDragStart.y;

    // Get container and image sizes
    let containerSize = { width: 0, height: 0 };
    let imageSize = { width: 0, height: 0 };

    if (slideRef.current) {
      const rect = slideRef.current.getBoundingClientRect();
      containerSize = {
        width: rect.width,
        height: rect.height,
      };
    }

    if (imageRef.current) {
      // Get the image element's computed style to get actual dimensions
      const computedStyle = window.getComputedStyle(imageRef.current);
      const imageWidth =
        parseFloat(computedStyle.width) || imageRef.current.offsetWidth;
      const imageHeight =
        parseFloat(computedStyle.height) || imageRef.current.offsetHeight;

      // Calculate zoomed size
      const zoomScale = zoom / INITIAL_ZOOM;
      imageSize = {
        width: imageWidth * zoomScale,
        height: imageHeight * zoomScale,
      };
    }

    // Calculate bounds: how far the zoomed image can move
    // When zoomed, image is larger than container, so we can pan it
    // The image can move half the difference between zoomed size and container size
    const maxX = Math.max(0, (imageSize.width - containerSize.width) / 2);
    const minX = -maxX;
    const maxY = Math.max(0, (imageSize.height - containerSize.height) / 2);
    const minY = -maxY;

    // Apply limit bounds
    const constrainedX = Math.max(minX, Math.min(maxX, newX));
    const constrainedY = Math.max(minY, Math.min(maxY, newY));

    setImagePosition({
      x: constrainedX,
      y: constrainedY,
    });
  };

  // Zoom mouse handlers
  const handleZoomMouseDown = (e: React.MouseEvent<HTMLImageElement>): void => {
    if (zoom <= INITIAL_ZOOM) return;

    e.preventDefault();
    e.stopPropagation();

    setIsZoomDragging(true);
    setZoomDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  // Zoom touch handlers
  const onZoomTouchStart = (e: React.TouchEvent<HTMLImageElement>): void => {
    if (zoom <= INITIAL_ZOOM) return;

    setIsZoomDragging(true);
    const touch = e.touches[0];
    setZoomDragStart({
      x: touch.clientX - imagePosition.x,
      y: touch.clientY - imagePosition.y,
    });
  };

  const onZoomTouchMove = (e: React.TouchEvent<HTMLImageElement>): void => {
    if (!isZoomDragging || zoom <= INITIAL_ZOOM) return;

    const touch = e.touches[0];
    processZoomSwipe(touch.clientX, touch.clientY);
  };

  const onZoomTouchEnd = (e: React.TouchEvent<HTMLImageElement>): void => {
    if (zoom <= INITIAL_ZOOM) return;

    setIsZoomDragging(false);
    cleanZoomMoving();
  };

  const onZoomTouchCancel = (e: React.TouchEvent<HTMLImageElement>): void => {
    if (zoom <= INITIAL_ZOOM) return;

    setIsZoomDragging(false);
    cleanZoomMoving();
  };

  const cleanZoomMoving = () => {
    // Clear existing timeout to prevent multiple timeouts
    if (zoomingTimerRef.current) clearTimeout(zoomingTimerRef.current);

    // Set new timeout to resume autoPlay after a delay
    zoomingTimerRef.current = setTimeout(
      () => (isZoomMovingRef.current = false),
      ZOOM_MOVING_DURATION
    );
  };

  // Add document-level mouse event listeners for zoom pan
  useEffect(() => {
    if (!isZoomDragging || zoom <= INITIAL_ZOOM) return;

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isZoomDragging) return;
      processZoomSwipe(e.clientX, e.clientY);
    };

    const handleMouseUp = (): void => {
      setIsZoomDragging(false);
      cleanZoomMoving();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isZoomDragging, zoom, zoomDragStart, imagePosition]);

  // Add document-level touch event listeners for zoom pan
  useEffect(() => {
    if (!isZoomDragging || zoom <= INITIAL_ZOOM) return;

    const handleTouchMove = (e: TouchEvent): void => {
      if (!isZoomDragging) return;
      e.preventDefault(); // Prevent scrolling when panning zoomed image
      const touch = e.touches[0];
      if (touch) {
        isZoomMovingRef.current = true;
        processZoomSwipe(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (): void => {
      setIsZoomDragging(false);
      cleanZoomMoving();
    };

    const handleTouchCancel = (): void => {
      setIsZoomDragging(false);
      cleanZoomMoving();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isZoomDragging, zoom, zoomDragStart, imagePosition]);

  useEffect(() => {
    // Reset position when zoom changes
    setImagePosition({ x: 0, y: 0 });
  }, [zoom]);

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

  // Process zoom in/out image
  const handleClick = (): void => {
    if (isMouseMoveRef.current || isZoomMovingRef.current) return;

    // Handle logic to Zoom in/out image
    // If zoom is INITIAL_ZOOM, set zoom to ZOOM_CLICK
    // Else set zoom to INITIAL_ZOOM
    if (zoom === INITIAL_ZOOM) {
      setZoom(ZOOM_CLICK);
    } else {
      setZoom(INITIAL_ZOOM);
    }
  };

  const getImageTransform = (index: number): string => {
    if (index !== currentIndex || zoom <= INITIAL_ZOOM) {
      return "none";
    }

    return `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${
      zoom / INITIAL_ZOOM
    })`;
  };

  const getImageTransition = (): string => {
    return isZoomDragging ? "none" : "transform 0.5s ease-in-out";
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(!isTransitioning &&
          zoom <= INITIAL_ZOOM && {
            onTouchStart: onTouchStart,
            onTouchMove: onTouchMove,
            onTouchEnd: onTouchEnd,
            onTouchCancel: onTouchCancel,
            onMouseDown: onMouseDown,
          })}
        onClick={handleClick}
      >
        <div
          ref={contentRef}
          className="image-slider-content"
          style={{
            transform: getTransform(),
            transition:
              (isTransitioning || isTransitioningAfterSnapBack) && !isDragging
                ? "transform 0.5s ease-in-out"
                : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((image, index) => (
            <div
              key={`${isLoop ? "loop-" : ""}${index}`}
              className="slide"
              ref={index === currentIndex ? slideRef : null}
            >
              <img
                ref={index === currentIndex ? imageRef : null}
                style={{
                  transform: getImageTransform(index),
                  transition: getImageTransition(),
                  cursor:
                    index === currentIndex && zoom > INITIAL_ZOOM
                      ? isZoomDragging
                        ? "grabbing"
                        : "grab"
                      : "pointer",
                  pointerEvents: "auto",
                }}
                src={image}
                alt={`Slide ${index + 1}`}
                className="slide-image"
                draggable={false}
                onMouseDown={handleZoomMouseDown}
                decoding="async"
                {...(zoom > INITIAL_ZOOM && {
                  onTouchStart: onZoomTouchStart,
                  onTouchMove: onZoomTouchMove,
                  onTouchEnd: onZoomTouchEnd,
                  onTouchCancel: onZoomTouchCancel,
                })}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && showNavigation && (
          <>
            <NavigationArrowPrevious
              onClick={goToPrevious}
              disabled={
                (!isLoop && realIndex === 0) ||
                isTransitioning ||
                zoom > INITIAL_ZOOM
              }
            />
            <NavigationArrowNext
              onClick={goToNext}
              disabled={
                (!isLoop && realIndex === images.length - 1) ||
                isTransitioning ||
                zoom > INITIAL_ZOOM
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;
