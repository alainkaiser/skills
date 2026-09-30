import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-brand text-brand-fg hover:bg-brand/90",
        variant === "secondary" && "border border-border bg-surface text-fg hover:bg-surface-subtle",
        className,
      )}
      {...props}
    />
  );
}
