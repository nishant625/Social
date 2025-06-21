import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// User functions
export async function getUserProfile(userId: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `user_${userId}@temp.com`, // Temporary email, will be updated by Clerk webhook
        },
      })
    }

    return user
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; username?: string; bio?: string; avatarUrl?: string },
) {
  try {
    // Ensure user exists first
    await getUserProfile(userId)

    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Post functions
export async function createPost(data: { content: string; imageUrl?: string; authorId: string }) {
  try {
    // Ensure user exists
    await getUserProfile(data.authorId)

    return await prisma.post.create({
      data: {
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error getting posts:", error)
    return []
  }
}

export async function likePost(postId: string) {
  try {
    return await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error("Error liking post:", error)
    throw error
  }
}

// Search functions
export async function searchUsers(query: string) {
  try {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
      },
      take: 10,
    })
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { id: username }],
      },
    })
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

export async function getUserPosts(userId: string) {
  try {
    return await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error getting user posts:", error)
    return []
  }
}
