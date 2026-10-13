import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";

type LinkButtonProps = ComponentProps<"a"> & { href: string };

export function LinkButton({
  children,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a className={`link-button ${className}`} {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
