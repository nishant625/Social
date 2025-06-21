// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // ✅ Exclude API routes like /api/uploadthing and /api/anything-you-want
  if (
    pathname.startsWith("/api/uploadthing") ||
    pathname.startsWith("/api/groups") // Add more if needed
  ) {
    return; // Let these API routes skip Clerk auth
  }

  // 🔐 Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except static files and _next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Also run on all API routes
    "/(api|trpc)(.*)",
  ],
};
