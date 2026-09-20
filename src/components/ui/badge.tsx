import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
          ${variant === "default" ? "border-transparent bg-blue-600 text-white" : ""}
          ${variant === "secondary" ? "border-transparent bg-gray-600 text-white" : ""}
          ${variant === "destructive" ? "border-transparent bg-red-600 text-white" : ""}
          ${variant === "outline" ? "text-gray-950 border-gray-300" : ""}
          ${className || ""}
        `}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }