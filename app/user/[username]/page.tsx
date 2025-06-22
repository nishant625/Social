import { notFound } from "next/navigation"
import { NavbarClassic } from "@/components/navbar-classic"
import { UserProfile } from "@/components/user-profile"
import { getUserByUsername } from "@/lib/db"

interface UserPageProps {
  params: { username: string }
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClassic />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <UserProfile user={user} />
      </main>
    </div>
  )
}
