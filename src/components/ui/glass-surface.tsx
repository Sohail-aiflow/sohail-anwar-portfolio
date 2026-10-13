import type { ComponentProps } from "react";

export function GlassSurface({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return <div className={`glass-surface ${className}`} {...props} />;
}
