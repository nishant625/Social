import { headers } from "next/headers"
import { Webhook } from "svix"
import { prisma } from "@/lib/db"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!webhookSecret) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data

    try {
      await prisma.user.upsert({
        where: { id },
        update: {
          email: email_addresses[0]?.email_address || `${id}@temp.com`,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          username: username || null,
          avatarUrl: image_url || null,
          updatedAt: new Date(),
        },
        create: {
          id,
          email: email_addresses[0]?.email_address || `${id}@temp.com`,
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          username: username || null,
          avatarUrl: image_url || null,
        },
      })

      console.log(`User ${eventType}:`, {
        id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`,
      })
    } catch (error) {
      console.error("Error syncing user:", error)
      return new Response("Error syncing user", { status: 500 })
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { id },
      })
      console.log(`User deleted:`, { id })
    } catch (error) {
      console.error("Error deleting user:", error)
      return new Response("Error deleting user", { status: 500 })
    }
  }

  return new Response("", { status: 200 })
}
