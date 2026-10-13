import type { ComponentProps } from "react";

export function IconTreatment({
  className = "",
  ...props
}: ComponentProps<"span">) {
  return <span className={`icon-tile ${className}`} {...props} />;
}
