import { useEffect, useState } from "react";

interface TerminalLineProps {
  prefix?: string;
  text: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  showPrefix?: boolean;
}

export function TerminalLine({ 
  prefix = "> ", 
  text, 
  delay = 30, 
  startDelay = 0,
  className = "",
  showPrefix = true 
}: TerminalLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setComplete(true);
    }
  }, [displayedText, text, delay, started]);

  if (!started) return null;

  return (
    <div className={`font-mono ${className}`}>
      {showPrefix && <span className="text-primary">{prefix}</span>}
      <span>{displayedText}</span>
      {!complete && <span className="animate-pulse">█</span>}
    </div>
  );
}
