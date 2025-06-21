"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from "@/lib/uploadthing"
import { Camera } from "lucide-react"

interface User {
  id: string
  name?: string
  username?: string
  bio?: string
  avatarUrl?: string
}

interface ProfileFormProps {
  user: User | null
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success!",
        description: "Your profile has been updated!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
              {formData.name?.[0]?.toUpperCase() || formData.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  setFormData({ ...formData, avatarUrl: res[0].url })
                  toast({
                    title: "Success!",
                    description: "Avatar uploaded successfully!",
                  })
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Error",
                  description: `Upload failed: ${error.message}`,
                  variant: "destructive",
                })
              }}
              appearance={{
                button: "bg-blue-500 hover:bg-blue-600 w-10 h-10 rounded-full p-0 flex items-center justify-center",
                allowedContent: "hidden",
              }}
              content={{
                button: <Camera className="w-4 h-4 text-white" />,
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <p className="text-sm text-gray-500">Click the camera icon to upload a new avatar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="your_username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="mt-1 min-h-[100px]"
          maxLength={200}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/200 characters</p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  )
}
