import * as React from "react"
import { cn } from "../../lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
        size === "sm" && "h-4 w-4 border-2",
        size === "md" && "h-6 w-6 border-2",
        size === "lg" && "h-8 w-8 border-3",
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Chargement...</span>
    </div>
  )
}
