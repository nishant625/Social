"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Home, User, Bell, Search, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
  post?: {
    id: string
    content: string
  }
  comment?: {
    id: string
    content: string
    author: {
      name: string
      username: string
      avatarUrl?: string
    }
  }
}

export function NavbarClassic() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotificationCount()
    const interval = setInterval(fetchNotificationCount, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch("/api/notifications/count")
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error("Error fetching notification count:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", { method: "PUT" })
      if (response.ok) {
        setUnreadCount(0)
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Search error:", error)
    }
  }

  return (
    <nav className="bg-[#2b9a9e] border-b border-[#29487d] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[42px]">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-white font-bold text-xl tracking-tight">SOCIAL MEDIA APP</div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                  setShowSearch(true)
                }}
                onFocus={() => setShowSearch(true)}
                className="w-full pl-8 pr-4 py-1 text-sm bg-white border border-[#29487d] rounded-sm focus:outline-none focus:border-white"
              />
            </div>

            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-64 overflow-y-auto z-50">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    href={`/user/${user.username || user.id}`}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery("")
                    }}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#3b5998] text-white text-xs">
                        {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                      {user.username && user.name && <p className="text-xs text-gray-500">@{user.username}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Navigation */}
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="flex items-center px-3 py-1 text-white hover:bg-[#29487d] rounded transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center px-3 py-1 text-white hover:bg-[#29487d] rounded transition-colors"
            >
              <User className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Profile</span>
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  if (!showNotifications) {
                    markAllAsRead()
                  }
                }}
                className="flex items-center px-3 py-1 text-white hover:bg-[#29487d] rounded transition-colors relative"
              >
                <Bell className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-sm shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                            {notification.post && (
                              <p className="text-xs text-gray-600 mt-1 italic">
                                "{notification.post.content.slice(0, 50)}..."
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-6 h-6",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
