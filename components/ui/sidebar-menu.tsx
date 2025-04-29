import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 p-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarMenu.displayName = "SidebarMenu"

export { SidebarMenu } 