"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "./post-card"
import { CalendarDays } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name?: string
  username?: string
  bio?: string
  avatarUrl?: string
  createdAt: string
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
}

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserPosts()
  }, [user.id])

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/posts`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching user posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map((post) => (post.id === postId ? { ...post, likeCount: updatedPost.likeCount } : post)))
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const joinedDate = formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h1>
              {user.username && user.name && <p className="text-gray-500 text-lg">@{user.username}</p>}
              {user.bio && <p className="text-gray-700 mt-2 leading-relaxed">{user.bio}</p>}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>Joined {joinedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                  <span>posts</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">This user hasn't shared anything yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
