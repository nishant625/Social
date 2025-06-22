"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface PostCardProps {
  post: {
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
    _count?: {
      comments: number
    }
  }
  onLike: () => void
  onComment: () => void
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Link href={`/user/${post.author.username || post.author.id}`}>
            <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
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
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {post.author.name || post.author.username}
              </Link>
              {post.author.username && post.author.name && (
                <span className="text-gray-500 text-sm">@{post.author.username}</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {post.imageUrl && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>{post.likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onComment}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post._count?.comments || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
