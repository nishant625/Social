import { type NextRequest, NextResponse } from "next/server"
import { likePost } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    const updatedPost = await likePost(postId)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}
