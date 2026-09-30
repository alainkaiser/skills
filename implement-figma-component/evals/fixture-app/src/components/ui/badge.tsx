import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-subtle px-2 py-0.5 text-xs font-medium text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
