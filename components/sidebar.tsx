"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Home,
  Compass,
  TrendingUp,
  Users,
  Gamepad2,
  Music,
  Newspaper,
  Film,
  Clock,
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bookmark,
  Settings,
  Sun,
  Moon,
  PlusCircle,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Flame,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number | string
  highlight?: boolean
}

const mainItems: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Sparkles, label: "Featured", href: "/featured" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: Music, label: "Music", href: "/music" },
  { icon: Film, label: "TMDB Movies", href: "/tmdb-movies", highlight: true },
];

const categoriesItems: SidebarItem[] = [
  { icon: Gamepad2, label: "Gaming", href: "/category/gaming" },
  { icon: Newspaper, label: "News", href: "/category/news" },
  { icon: Film, label: "Movies", href: "/category/movies" },
];

const libraryItems: SidebarItem[] = [
  { icon: Clock, label: "Watch Later", href: "/watch-later", badge: 5 },
  { icon: History, label: "History", href: "/history" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
];

// Define props interface
interface SidebarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  shouldOverlay?: boolean;
  userData?: {
    name: string;
    avatar?: string;
    email?: string;
  };
}

export default function Sidebar({ 
  isMobileMenuOpen, 
  closeMobileMenu, 
  toggleMobileMenu,
  shouldOverlay = false,
  userData = { name: "User", avatar: "" } 
}: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [notifications, setNotifications] = useState(3)
  const [customCategories, setCustomCategories] = useState<SidebarItem[]>([])
  const [pinned, setPinned] = useState<SidebarItem[]>([])
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  // Load saved state after mount
  useEffect(() => {
    // For movies page (shouldOverlay=true), we always keep it collapsed and don't load saved state
    if (!shouldOverlay) {
      const savedState = localStorage.getItem("sidebarCollapsed")
      if (savedState !== null) {
        setIsCollapsed(savedState === "true")
      }
    }
  }, [shouldOverlay]);

  // Save collapsed state in localStorage
  useEffect(() => {
    if (!shouldOverlay) {
      localStorage.setItem("sidebarCollapsed", String(isCollapsed))
    }
  }, [isCollapsed, shouldOverlay])

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      closeMobileMenu()
    }
  }, [isMobile, closeMobileMenu])

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    if (isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) && 
          isMobileMenuOpen
        ) {
          closeMobileMenu()
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMobile, isMobileMenuOpen, closeMobileMenu])

  // For demonstration purposes, simulate adding a custom category
  const addCustomCategory = () => {
    const newCategory: SidebarItem = {
      icon: PlusCircle,
      label: `Custom ${customCategories.length + 1}`,
      href: `/custom-${customCategories.length + 1}`,
    }
    setCustomCategories([...customCategories, newCategory])
  }

  // For demonstration purposes, simulate pinning an item
  const togglePinItem = (item: SidebarItem) => {
    if (pinned.some(pinnedItem => pinnedItem.href === item.href)) {
      setPinned(pinned.filter(pinnedItem => pinnedItem.href !== item.href))
    } else {
      setPinned([...pinned, item])
    }
  }

  const renderSidebarItem = (item: SidebarItem, isPinnable = false) => {
    const isActive = pathname === item.href
    const isPinned = pinned.some(pinnedItem => pinnedItem.href === item.href)
    
    // Special handling for TMDB Movies on small screens
    const displayLabel = item.href === "/tmdb-movies" 
      ? <span className="flex">
          <span className="xs:hidden">TMDB</span>
          <span className="hidden xs:inline">TMDB Movies</span>
        </span>
      : item.label;
    
    const linkContent = (
      <>
        <item.icon className={cn(
          "h-5 w-5", 
          !isCollapsed && "mr-2",
          item.highlight && "text-primary"
        )} />
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <span className={item.highlight ? "font-medium text-primary" : ""}>{displayLabel}</span>
            {item.badge && (
              <Badge variant="outline" className="ml-2">
                {item.badge}
              </Badge>
            )}
          </div>
        )}
      </>
    )

    const itemContent = (
      <div className="group flex items-center">
        <Link
          href={item.href}
          className={cn(
            "flex flex-1 items-center rounded-md px-3 py-2 text-sm font-medium",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            shouldOverlay && isCollapsed && "justify-center"
          )}
        >
          {linkContent}
        </Link>
        
        {isPinnable && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault()
              togglePinItem(item)
            }}
          >
            <Bookmark 
              className={cn("h-4 w-4", isPinned && "fill-current text-primary")} 
            />
          </Button>
        )}
      </div>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider key={item.href} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                  shouldOverlay && "mx-auto"
                )}
              >
                {linkContent}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
              {item.badge && <Badge variant="outline" className="ml-2">{item.badge}</Badge>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        layout
      >
        {itemContent}
      </motion.div>
    )
  }

  const SidebarContent = () => {
    // Filter out pinned items from main sections
    const filteredMainItems = mainItems.filter(
      item => !pinned.some(pinnedItem => pinnedItem.href === item.href)
    )
    const filteredCategoriesItems = [...categoriesItems, ...customCategories].filter(
      item => !pinned.some(pinnedItem => pinnedItem.href === item.href)
    )
    const filteredLibraryItems = libraryItems.filter(
      item => !pinned.some(pinnedItem => pinnedItem.href === item.href)
    )

    return (
      <>
        {pinned.length > 0 && (
          <div className="px-3 py-2">
            <h2 className={cn("mb-2 text-lg font-semibold tracking-tight", isCollapsed && "sr-only")}>
              Pinned
            </h2>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {pinned.map(item => (
                  <motion.div key={item.href}>
                    {renderSidebarItem(item)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="px-3 py-2">
          <h2 className={cn("mb-2 text-lg font-semibold tracking-tight", isCollapsed && "sr-only")}>
            Main
          </h2>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {filteredMainItems.map(item => (
                <motion.div key={item.href}>
                  {renderSidebarItem(item, true)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className={cn("text-lg font-semibold tracking-tight", isCollapsed && "sr-only")}>
              Categories
            </h2>
            {!isCollapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={addCustomCategory}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {filteredCategoriesItems.map(item => (
                <motion.div key={item.href}>
                  {renderSidebarItem(item, true)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className={cn("mb-2 text-lg font-semibold tracking-tight", isCollapsed && "sr-only")}>
            Library
          </h2>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {filteredLibraryItems.map(item => (
                <motion.div key={item.href}>
                  {renderSidebarItem(item, true)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto px-3 py-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            </div>
          )}

          {/* Don't show expand/collapse buttons when in movies page (shouldOverlay=true) */}
          {!shouldOverlay && (isCollapsed ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full h-9 mt-2"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsCollapsed(true)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Collapse
            </Button>
          ))}
        </div>
      </>
    )
  }

  const UserProfile = () => (
    <div className={cn(
      "border-t pt-2 pb-3",
      isCollapsed ? "px-2" : "px-3",
    )}>
      {isCollapsed ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      {userData.avatar ? (
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                      ) : (
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      {userData.avatar ? (
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                      ) : (
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userData.name}</p>
                      {userData.email && (
                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{userData.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start font-normal"
            >
              <Avatar className="h-6 w-6 mr-2">
                {userData.avatar ? (
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                ) : (
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span className="truncate">{userData.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <Avatar className="h-8 w-8">
                {userData.avatar ? (
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                ) : (
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{userData.name}</p>
                {userData.email && (
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <aside
          ref={sidebarRef}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background border-t transition-transform duration-300 ease-in-out",
            "md:hidden" // Ensure it's only visible on mobile
          )}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {mainItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              // Handle TMDB Movies display on mobile - show "TMDB" on extra small screens, full name on larger
              let displayLabel = item.label;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full",
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mb-1",
                    item.highlight && "text-primary"
                  )} />
                  {item.href === "/tmdb-movies" ? (
                    <>
                      <span className="text-xs block xs:hidden">TMDB</span>
                      <span className="text-xs hidden xs:block">TMDB Movies</span>
                    </>
                  ) : (
                    <span className="text-xs">{displayLabel}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        shouldOverlay && !isCollapsed && "fixed z-40 shadow-lg",
        shouldOverlay && !isCollapsed && "bg-background/80 backdrop-blur-md",
        shouldOverlay && "border-r-0"
      )}
      style={{
        ...(shouldOverlay && {
          borderRightColor: 'transparent'
        })
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarContent />
        </div>
        {/* Don't render UserProfile when in movies page (shouldOverlay=true) */}
        {!shouldOverlay && <UserProfile />}
      </div>
    </aside>
  )
}