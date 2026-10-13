import type { ComponentProps } from "react";

export function PageContainer({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return <div className={`page-container ${className}`} {...props} />;
}
