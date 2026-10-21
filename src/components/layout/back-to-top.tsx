"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Link
      href="/#home"
      className="back-to-top"
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          pathname !== "/"
        )
          return;
        // Repeated fragments need an explicit scroll. A changed fragment keeps
        // normal router history, while scrolling to the actual document top.
        event.preventDefault();
        if (window.location.hash !== "#home")
          router.push("/#home", { scroll: false });
        requestAnimationFrame(() => {
          document.getElementById("home")?.focus({ preventScroll: true });
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          });
        });
      }}
    >
      Back to top <ArrowUp size={16} aria-hidden="true" />
    </Link>
  );
}
