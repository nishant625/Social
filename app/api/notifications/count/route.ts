import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getUnreadNotificationCount } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const count = await getUnreadNotificationCount(userId)
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching notification count:", error)
    return NextResponse.json({ error: "Failed to fetch notification count" }, { status: 500 })
  }
}
