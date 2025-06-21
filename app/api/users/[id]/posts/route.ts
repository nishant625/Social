import { type NextRequest, NextResponse } from "next/server"
import { getUserPosts } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const posts = await getUserPosts(userId)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 })
  }
}
