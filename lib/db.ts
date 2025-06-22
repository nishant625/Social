import { PrismaClient } from "@prisma/client"
import { currentUser } from "@clerk/nextjs/server"

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
      // Get user data from Clerk
      const clerkUser = await currentUser()

      if (clerkUser && clerkUser.id === userId) {
        // Create user with Clerk data
        user = await prisma.user.create({
          data: {
            id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@temp.com`,
            name:
              clerkUser.firstName && clerkUser.lastName
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.lastName || null,
            username: clerkUser.username || null,
            avatarUrl: clerkUser.imageUrl || null,
          },
        })
      } else {
        // Fallback: create minimal user
        user = await prisma.user.create({
          data: {
            id: userId,
            email: `user_${userId}@temp.com`,
          },
        })
      }
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
        _count: {
          select: {
            comments: true,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error getting posts:", error)
    return []
  }
}

export async function getPostWithComments(postId: string) {
  try {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        comments: {
          orderBy: { createdAt: "asc" },
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
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error getting post with comments:", error)
    return null
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

// Comment functions
export async function createComment(data: { content: string; authorId: string; postId: string }) {
  try {
    // Ensure user exists
    await getUserProfile(data.authorId)

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        authorId: data.authorId,
        postId: data.postId,
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
        post: {
          select: {
            authorId: true,
            content: true,
          },
        },
      },
    })

    // Create notification for post author (if not commenting on own post)
    if (comment.post.authorId !== data.authorId) {
      await prisma.notification.create({
        data: {
          userId: comment.post.authorId,
          type: "comment",
          message: `${comment.author.name || comment.author.username || "Someone"} commented on your post`,
          postId: data.postId,
          commentId: comment.id,
        },
      })
    }

    return comment
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

// Notification functions
export async function getUserNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            content: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      take: 20,
    })
  } catch (error) {
    console.error("Error getting notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    })
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    return 0
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error getting user posts:", error)
    return []
  }
}
