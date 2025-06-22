"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    avatarUrl?: string
  }
}

interface Post {
  id: string
  content: string
  imageUrl?: string
  likeCount: number
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    avatarUrl?: string
  }
  comments: Comment[]
  _count: {
    comments: number
  }
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

export function CommentsModal({ isOpen, onClose, postId }: CommentsModalProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && postId) {
      fetchPostWithComments()
    }
  }, [isOpen, postId])

  const fetchPostWithComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        setNewComment("")
        await fetchPostWithComments() // Refresh comments
        toast({
          title: "Success!",
          description: "Comment added successfully",
        })
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!post && !isLoading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Comments</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : post ? (
          <div className="flex flex-col h-full">
            {/* Original Post */}
            <div className="p-6 border-b">
              <div className="flex space-x-3">
                <Link href={`/user/${post.author.username || post.author.id}`}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {post.author.name?.[0]?.toUpperCase() || post.author.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/user/${post.author.username || post.author.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {post.author.name || post.author.username}
                    </Link>
                    <span className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-900 mt-1">{post.content}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt="Post image"
                      className="mt-3 rounded-lg max-h-64 object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Comments */}
            <ScrollArea className="flex-1 p-6">
              {post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Link href={`/user/${comment.author.username || comment.author.id}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                            {comment.author.name?.[0]?.toUpperCase() ||
                              comment.author.username?.[0]?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/user/${comment.author.username || comment.author.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 text-sm"
                          >
                            {comment.author.name || comment.author.username}
                          </Link>
                          <span className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-900 text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </ScrollArea>

            {/* Comment Input */}
            <div className="p-6 border-t">
              <form onSubmit={handleSubmitComment} className="flex space-x-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  maxLength={500}
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="self-end">
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
