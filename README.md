# SocialHub - Modern Social Media Platform

A modern, responsive social media platform built with Next.js, Prisma, PostgreSQL, and Clerk authentication.

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk
- 👤 **User Profiles** - Customizable profiles with avatars and bios
- 📝 **Post Creation** - Share text and images with file upload
- ❤️ **Post Reactions** - Like posts (multiple likes allowed)
- 🔍 **User Search** - Find and discover other users
- 👥 **Profile Pages** - View individual user profiles and their posts
- 📱 **Responsive Design** - Works perfectly on mobile and desktop

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **File Upload**: UploadThing
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase, Neon, etc.)
- Clerk account
- UploadThing account

## 🛠️ Setup Instructions

### 1. Clone and Install
\`\`\`bash
git clone <your-repo-url>
cd social-media-platform
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env.local\` file:

\`\`\`env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# UploadThing
UPLOADTHING_SECRET=your-uploadthing-secret-key
UPLOADTHING_TOKEN=your-uploadthing-token
\`\`\`

### 3. Database Setup
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see your application!

## 🔧 Service Setup

### Clerk Authentication
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Copy your publishable key and secret key
4. Set redirect URLs: \`http://localhost:3000/sign-in\`, \`http://localhost:3000/sign-up\`

### UploadThing File Upload
1. Create account at [uploadthing.com](https://uploadthing.com)
2. Create new app
3. Copy your secret key and token from the dashboard
4. Configure file size limits (default: 4MB for images)

### Database (PostgreSQL)
Use any PostgreSQL provider:
- **Supabase** (recommended): Free tier available
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple deployment
- **Local**: PostgreSQL on your machine

## 📁 Key Features

### Authentication & Profiles
- Secure sign-up/login with Clerk
- Customizable user profiles with name, username, bio
- Avatar upload with UploadThing
- Protected routes and middleware

### Posts & Feed
- Create posts with text and image uploads
- Global feed showing all posts chronologically
- Real-time like functionality (multiple likes per post)
- Responsive post cards with user avatars

### Social Features
- Search for users by name or username
- Click on usernames/avatars to view profiles
- Individual user profile pages showing their posts
- User discovery and interaction

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
Set these in your deployment platform:
- \`DATABASE_URL\`
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\`
- \`CLERK_SECRET_KEY\`
- \`UPLOADTHING_SECRET\`
- \`UPLOADTHING_TOKEN\`

## 🎯 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npx prisma generate\` - Generate Prisma client
- \`npx prisma db push\` - Push schema to database
- \`npx prisma studio\` - Open database GUI

## 🔒 Security Features

- Server-side authentication validation
- Protected API routes with Clerk
- File upload security with UploadThing
- Input sanitization and validation
- Secure database queries with Prisma

## 📝 API Endpoints

- \`GET /api/posts\` - Fetch all posts
- \`POST /api/posts\` - Create new post
- \`POST /api/posts/[id]/like\` - Like a post
- \`PUT /api/profile\` - Update user profile
- \`GET /api/search\` - Search users
- \`GET /api/users/[id]/posts\` - Get user's posts
- \`POST /api/uploadthing\` - Handle file uploads

## 🐛 Troubleshooting

### UploadThing Issues
- Ensure \`UPLOADTHING_TOKEN\` has no quotes in .env.local
- Check that \`app/api/uploadthing/route.ts\` exists
- Verify your UploadThing app is active in dashboard

### Database Connection
- Test your \`DATABASE_URL\` connection
- Run \`npx prisma db push\` to sync schema
- Check database provider dashboard for connection issues

### Clerk Authentication
- Verify redirect URLs match your domain
- Check that environment variables are correctly set
- Ensure Clerk app is configured for your domain

## 📄 License

This project is open source and available under the MIT License.
\`\`\`
