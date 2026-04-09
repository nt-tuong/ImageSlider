import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import MessageHelperIcon from "../../icons/MessageHelperIcon";
import "./index.css";

export interface MessageHelperProps {
    messages: string[];
    intervalMs?: number;
}

const MIN_CLIENT_HEIGHT = 20;
const MIN_HEIGHT = 38;
const MAX_HEIGHT = 64;

const MessageHelper = ({
    messages,
    intervalMs = 5000,
}: MessageHelperProps) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDone, setIsDone] = useState(false);

    const messagesKey = messages.join("\u0001");

    useEffect(() => {
        setActiveIndex(0);
        setIsDone(false);
    }, [messagesKey]);

    useEffect(() => {
        if (messages.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => {
                const next = prev + 1;
                if (next >= messages.length) {
                    clearInterval(interval);
                    setIsDone(true);
                    return prev;
                }
                return next;
            });
        }, intervalMs);
        return () => clearInterval(interval);
    }, [messagesKey, messages.length, intervalMs]);

    const activeMessage = messages[activeIndex];

    useLayoutEffect(() => {
        if (!spanRef.current || !boxRef.current) return;
        const span = spanRef.current;
        const box = boxRef.current;
        const adjust = () => {
            box.style.height = span.clientHeight > MIN_CLIENT_HEIGHT ? `${MAX_HEIGHT}px` : `${MIN_HEIGHT}px`;
        };
        adjust();
        document.fonts.ready.then(adjust);

        const ro = new ResizeObserver(() => {
            adjust();
        });
        ro.observe(span);

        return () => ro.disconnect();
    }, [activeIndex, activeMessage]);

    if (messages.length === 0 || isDone) return null;

    return (
        <div ref={boxRef} className="box">
            <MessageHelperIcon />
            <span ref={spanRef} className="text">
                {activeMessage}
            </span>
        </div>
    );
};

export default MessageHelper;