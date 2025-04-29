import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarMenuButtonProps extends React.ComponentProps<typeof Button> {
  tooltip?: string
  children: React.ReactNode
}

const SidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarMenuButtonProps
>(({ className, tooltip, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("justify-start gap-2", className)}
      {...props}
    >
      {children}
    </Button>
  )
})

SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenuButton } 