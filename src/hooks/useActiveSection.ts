import { useEffect, useState } from "react";

/**
 * Tracks which section (by element id) is currently most visible in the viewport.
 */
export function useActiveSection(ids: string[], offset = 120): string {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollPos = window.scrollY + offset;
      let current = "";
      for (const el of elements) {
        if (el.offsetTop <= scrollPos) current = el.id;
      }
      // At the very bottom of the page, highlight the last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        current = elements[elements.length - 1].id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
