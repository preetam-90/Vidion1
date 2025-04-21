"use client"

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share, Copy, Check, Mail, Facebook, Twitter } from 'lucide-react'
import { toast } from "sonner"

export interface SharePopupProps {
  isOpen: boolean
  url: string
  title?: string
  onClose: () => void
}

export default function SharePopup({ isOpen, url, title = 'Check out this video', onClose }: SharePopupProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        toast.success('Link copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
        toast.error('Failed to copy link')
      })
  }

  const handleShare = (platform: string) => {
    let shareLink = ''
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this video: ${title}`)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(`Check out this video: ${title}`)}&body=${encodeURIComponent(`I thought you might enjoy this video: ${shareUrl}`)}`
        break
      default:
        return
    }
    
    window.open(shareLink, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Video</DialogTitle>
          <DialogDescription>
            Share this video with your friends and followers
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input 
            value={shareUrl}
            readOnly
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
            className="shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Facebook className="h-5 w-5 mb-1" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Twitter className="h-5 w-5 mb-1" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('email')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Mail className="h-5 w-5 mb-1" />
            <span className="text-xs">Email</span>
          </Button>
        </div>
        
        <DialogFooter className="flex justify-end mt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
