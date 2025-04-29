"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { Menu, Home, TrendingUp, Music, Clock, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { SidebarContent } from "@/components/ui/sidebar-content"
import { SidebarMenu } from "@/components/ui/sidebar-menu"
import { SidebarMenuItem } from "@/components/ui/sidebar-menu-item"
import { SidebarMenuButton } from "@/components/ui/sidebar-menu-button"

const SIDEBAR_WIDTH_MOBILE = "100%"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <Menu />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SimplifiedSidebarContent = () => {
  const categories = [
    { id: "home", name: "Home", icon: Home },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "music", name: "Music", icon: Music },
    { id: "watchlater", name: "Watch Later", icon: Clock },
    { id: "history", name: "History", icon: History },
  ]

  return (
    <SidebarContent>
      <SidebarMenu>
        {categories.map((category) => (
          <SidebarMenuItem key={category.id}>
            <SidebarMenuButton
              tooltip={category.name}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <category.icon className="size-4" />
              <span>{category.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  )
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, openMobile, setOpenMobile } = useSidebar()
    const isMobile = useMobile()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          <SimplifiedSidebarContent />
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SimplifiedSidebarContent />
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            <SimplifiedSidebarContent />
          </div>
        </div>
      </div>
    )
  }
)

Sidebar.displayName = "Sidebar"

export { Sidebar, SidebarTrigger }