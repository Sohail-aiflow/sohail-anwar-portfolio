import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";

type LinkButtonProps = ComponentProps<"a"> & { href: string };

export function LinkButton({
  children,
  className = "",
  ...props
}: LinkButtonProps) {
  const newTab = props.target === "_blank";
  const label = props["aria-label"];
  const rel = newTab
    ? [
        ...new Set([
          ...(props.rel?.split(/\s+/) ?? []),
          "noopener",
          "noreferrer",
        ]),
      ].join(" ")
    : props.rel;
  return (
    <a
      className={`link-button ${className}`}
      {...props}
      rel={rel}
      aria-label={
        newTab && label && !label.includes("opens in a new tab")
          ? `${label} (opens in a new tab)`
          : label
      }
    >
      {children}
      {newTab && !label && (
        <span className="sr-only"> (opens in a new tab)</span>
      )}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
