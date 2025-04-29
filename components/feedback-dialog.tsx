"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

const feedbackReasons = [
  { id: "watched", label: "I've already watched the video" },
  { id: "dislike", label: "I don't like the video" },
]

export function FeedbackDialog({ isOpen, onClose, onSubmit }: FeedbackDialogProps) {
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
      <DialogContent className="sm:max-w-md bg-[#282828] border-none">
        <DialogTitle className="text-lg font-medium mb-4">Tell us why</DialogTitle>
        <div className="space-y-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {feedbackReasons.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label htmlFor={reason.id} className="text-sm">{reason.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedReason}
            className="bg-neutral-600 hover:bg-neutral-700"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 