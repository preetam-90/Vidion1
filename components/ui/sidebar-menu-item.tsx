import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarMenuItem.displayName = "SidebarMenuItem"

export { SidebarMenuItem } 