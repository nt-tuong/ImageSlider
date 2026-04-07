import { RefObject, useCallback, useEffect, useState } from "react";

const useFadeEffect = (ref: RefObject<HTMLDivElement | null>) => {
    const [showFade, setShowFade] = useState(false);

    const checkFade = useCallback(() => {
        const el = ref?.current;
        if (!el) return;

        const hasScroll = el.scrollWidth > el.clientWidth;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        setShowFade(hasScroll && !atEnd);
    }, [ref]);

    useEffect(() => {
        const el = ref?.current;
        if (!el) return;

        checkFade();
        el.addEventListener("scroll", checkFade);
        window.addEventListener("resize", checkFade);
        
        // Cleanup on unmount
        return () => {
            el.removeEventListener("scroll", checkFade);
            window.removeEventListener("resize", checkFade);
        };
    }, [checkFade]);

    return showFade;
};

export default useFadeEffect;