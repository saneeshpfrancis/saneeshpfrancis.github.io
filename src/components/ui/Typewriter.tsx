import { useEffect, useState } from "react";

type TypewriterProps = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  className?: string;
};

export function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1800,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout: number;

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = window.setTimeout(
        () => {
          setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
        },
        deleting ? deletingSpeed : typingSpeed,
      );
    }

    return () => window.clearTimeout(timeout);
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-blink bg-primary align-baseline" />
    </span>
  );
}
