import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { Navbar } from "@/components/navbar"
import { getUserProfile } from "@/lib/db"

export default async function ProfilePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await getUserProfile(userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
          <ProfileForm user={user} />
        </div>
      </main>
    </div>
  )
}
