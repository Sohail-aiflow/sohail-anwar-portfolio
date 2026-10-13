"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Layers3, UserRound, Shapes, Send } from "lucide-react";
import { navigationItems, type SectionId } from "@/data/navigation";

const icons = {
  home: House,
  work: Layers3,
  about: UserRound,
  skills: Shapes,
  connect: Send,
};

export function FloatingNavigation() {
  const pathname = usePathname();
  const [floating, setFloating] = useState(false);
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const header = document.querySelector("[data-header-region]");
    if (!header) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setFloating(!entry.isIntersecting);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navigationItems.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    const visible = new Map<string, Element>();
    const updateActive = () => {
      // Short final sections can share the same clamped scroll position.
      // Honor the requested anchor only when its scroll destination is reached.
      const requested = sections.find(
        (section) => `#${section.id}` === window.location.hash,
      );
      const maximumScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (requested) {
        const offset =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) || 0;
        const destination = Math.min(
          maximumScroll,
          Math.max(
            0,
            requested.getBoundingClientRect().top + window.scrollY - offset,
          ),
        );
        if (Math.abs(window.scrollY - destination) < 3) {
          setActive(requested.id as SectionId);
          return;
        }
      }
      const current = sections.find((section) => visible.has(section.id));
      if (Math.abs(window.scrollY - maximumScroll) < 3) setActive("connect");
      else if (current) setActive(current.id as SectionId);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.target);
          else visible.delete(entry.target.id);
        }
        updateActive();
      },
      { rootMargin: "-18% 0px -32% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    // One callback after scrolling settles, never a per-frame scroll listener.
    document.addEventListener("scrollend", updateActive);
    window.addEventListener("hashchange", updateActive);
    return () => {
      observer.disconnect();
      document.removeEventListener("scrollend", updateActive);
      window.removeEventListener("hashchange", updateActive);
    };
  }, [pathname]);

  return (
    <nav
      className="primary-navigation"
      data-floating={floating}
      aria-label="Primary"
    >
      <ul className="navigation-list">
        {navigationItems.map(({ id, label }) => {
          const Icon = icons[id];
          return (
            <li key={id}>
              <Link
                href={`/#${id}`}
                aria-current={
                  pathname === "/" && active === id ? "location" : undefined
                }
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  if (pathname !== "/") return;
                  setActive(id);
                  requestAnimationFrame(() =>
                    document.getElementById(id)?.focus({ preventScroll: true }),
                  );
                }}
              >
                <Icon
                  className="navigation-icon"
                  size={19}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
