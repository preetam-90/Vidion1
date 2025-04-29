"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react"

interface Comment {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  dislikes: number
}

interface CommentSectionProps {
  videoId: string
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "This is an amazing video! Thanks for sharing your knowledge.",
      timestamp: "3 days ago",
      likes: 24,
      dislikes: 2,
    },
    {
      id: "2",
      user: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=5",
      content: "Very helpful content. Could you please make a follow-up on this topic?",
      timestamp: "1 week ago",
      likes: 15,
      dislikes: 0,
    },
    {
      id: "3",
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=8",
      content: "I've been looking for this explanation for a long time. Really well done!",
      timestamp: "2 weeks ago",
      likes: 32,
      dislikes: 3,
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        user: "Current User",
        avatar: "https://i.pravatar.cc/150?img=3",
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        dislikes: 0,
      }
      
      setComments([comment, ...comments])
      setNewComment("")
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{comments.length} Comments</h2>
      
      {/* Comment form */}
      <div className="flex gap-4 mb-6">
        <Avatar className="h-10 w-10">
          <img src="https://i.pravatar.cc/150?img=3" alt="Your avatar" />
        </Avatar>
        <div className="flex-1">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewComment("")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <img src={comment.avatar} alt={`${comment.user}'s avatar`} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium">{comment.user}</p>
                <p className="text-muted-foreground text-sm">{comment.timestamp}</p>
              </div>
              <p className="text-sm mb-2">{comment.content}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{comment.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{comment.dislikes}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 