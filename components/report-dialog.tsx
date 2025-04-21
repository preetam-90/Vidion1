"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

const reportReasons = [
  { id: "spam", label: "It's spam or misleading" },
  { id: "sexual", label: "Sexual content" },
  { id: "violent", label: "Violent or repulsive content" },
  { id: "hateful", label: "Hateful or abusive content" },
  { id: "harmful", label: "Harmful or dangerous acts" },
]

export function ReportDialog({ isOpen, onClose, onSubmit }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>("")

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason)
      onClose()
      setSelectedReason("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background/60 backdrop-blur-xl border border-neutral-200/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-semibold">Report content</DialogTitle>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your feedback helps us improve the quality of content.
            What's the issue with this content?
          </p>
          
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {reportReasons.map((reason) => (
              <div 
                key={reason.id} 
                className="flex items-center space-x-2 rounded-lg p-3 transition-colors hover:bg-neutral-800/20"
              >
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label 
                  htmlFor={reason.id}
                  className="text-sm font-medium cursor-pointer flex-grow"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-neutral-200/10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-neutral-800/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="bg-rose-600/90 hover:bg-rose-600 text-white backdrop-blur-sm"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 