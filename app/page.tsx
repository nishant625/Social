import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Feed } from "@/components/feed"
import { CreatePost } from "@/components/create-post"
import { Navbar } from "@/components/navbar"

export default async function HomePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <CreatePost />
          <Feed />
        </div>
      </main>
    </div>
  )
}
