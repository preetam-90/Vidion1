import { create } from 'zustand'
import { useMobile } from '@/hooks/use-mobile'

interface SidebarStore {
  isOpen: boolean
  state: 'expanded' | 'collapsed'
  isMobile: boolean
  openMobile: boolean
  toggle: () => void
  open: () => void
  close: () => void
  toggleSidebar: () => void
  setOpenMobile: (open: boolean) => void
}

export const useSidebar = create<SidebarStore>((set) => {
  // Initialize with mobile state
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  return {
    isOpen: false,
    state: 'expanded',
    isMobile,
    openMobile: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggleSidebar: () => set((state) => ({ 
      state: state.state === 'expanded' ? 'collapsed' : 'expanded' 
    })),
    setOpenMobile: (open) => set({ openMobile: open }),
  }
}) 