# SocialHub - Modern Social Media Platform

A modern, responsive social media platform built with Next.js, Prisma, PostgreSQL, and Clerk authentication.

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk
- 👤 **User Profiles** - Customizable profiles with avatars and bios
- 📝 **Post Creation** - Share text and images
- ❤️ **Post Reactions** - Like posts (multiple likes allowed)
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🎨 **Modern UI** - Clean, professional design

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (hosted)
- Clerk account

## 🛠️ Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd social-media-platform
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
\`\`\`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see your application!

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run db:generate\` - Generate Prisma client
- \`npm run db:push\` - Push schema changes to database
- \`npm run db:studio\` - Open Prisma Studio

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   └── profile/           # User profile page
├── components/            # React components
├── lib/                   # Utility functions and database
├── prisma/               # Database schema
└── scripts/              # Database setup scripts
\`\`\`

## 🎯 Key Features Implemented

### Authentication
- Secure sign-up and login with Clerk
- Protected routes and middleware
- User session management

### User Profiles
- Customizable profiles with name, username, bio
- Avatar support via URL
- Profile editing functionality

### Posts & Feed
- Create posts with text and optional images
- Global feed showing all posts
- Real-time like functionality
- Responsive post cards

### Database Design
- Optimized PostgreSQL schema
- Efficient indexing for performance
- Proper foreign key relationships

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- \`DATABASE_URL\`
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\`
- \`CLERK_SECRET_KEY\`
- \`NEXT_PUBLIC_CLERK_SIGN_IN_URL\`
- \`NEXT_PUBLIC_CLERK_SIGN_UP_URL\`

## 🔒 Security Features

- Server-side authentication validation
- Protected API routes
- Input sanitization and validation
- Secure database queries with Prisma

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations and transitions
- Mobile-first responsive design
- Accessible components
- Loading states and error handling

## 📝 API Endpoints

- \`GET /api/posts\` - Fetch all posts
- \`POST /api/posts\` - Create new post
- \`POST /api/posts/[id]/like\` - Like a post
- \`PUT /api/profile\` - Update user profile

## 🐛 Known Issues & Limitations

- Image uploads are via URL only (no file upload yet)
- No real-time updates (requires page refresh)
- Basic like system (no unlike functionality)
- No post editing or deletion

## 🔮 Future Enhancements

- File upload for images
- Real-time updates with WebSockets
- Comments on posts
- User following system
- Post editing and deletion
- Advanced search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
\`\`\`
