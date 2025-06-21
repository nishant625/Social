"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Send, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from "@/lib/uploadthing"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something to share!",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      setContent("")
      setImageUrl("")
      toast({
        title: "Success!",
        description: "Your post has been shared!",
      })

      // Refresh the page to show the new post
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">What's on your mind?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
            maxLength={500}
          />

          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Upload preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setImageUrl("")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setImageUrl(res[0].url)
                    toast({
                      title: "Success!",
                      description: "Image uploaded successfully!",
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
                  button: "bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 text-sm rounded-lg border-0",
                  allowedContent: "hidden",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{content.length}/500 characters</span>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
