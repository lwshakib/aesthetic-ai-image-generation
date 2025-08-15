# 🎨 Aesthetic AI Image Generation

A modern, full-stack web application that leverages advanced AI models to generate stunning artwork from text prompts. Built with Next.js 15, TypeScript, and powered by cutting-edge AI services.

![Aesthetic AI Image Generation](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality

- **AI-Powered Image Generation**: Create stunning artwork using advanced AI models
- **Prompt Enhancement**: Automatically enhance your prompts for better results using Gemini AI
- **Customizable Parameters**: Control width, height, inference steps, seed values, and file formats
- **Negative Prompts**: Specify what you don't want in your generated images
- **High-Resolution Output**: Generate images up to 2048x2048 pixels
- **Multiple Formats**: Export in PNG or JPG formats

### 🎨 User Experience

- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Generation**: Watch your images come to life with live progress indicators
- **Image Management**: Save, organize, and favorite your generated images
- **Social Sharing**: Share your creations directly from the app
- **Download Options**: Download images in high quality for personal or commercial use

### 🔐 Authentication & Billing

- **Secure Authentication**: Powered by Clerk for seamless user management
- **Credit System**: Free tier with limited credits, upgrade for unlimited generation
- **Premium Plans**: Multiple subscription tiers with enhanced features
- **User Dashboard**: Track your usage and manage your account

### 🛠️ Developer Features

- **RESTful API**: Complete API for integrating AI generation into your applications
- **TypeScript Support**: Full type safety throughout the application
- **Database Management**: Prisma ORM with PostgreSQL for reliable data storage
- **Middleware Support**: Custom routing and authentication middleware

## 🚀 Tech Stack

### Frontend

- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI components
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management
- **Zustand**: Lightweight state management

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database toolkit and ORM
- **PostgreSQL**: Reliable relational database
- **Clerk**: Authentication and user management
- **OpenAI API**: Integration with AI services
- **Google Gemini AI**: Prompt enhancement and AI features

### AI Services

- **Nebius AI**: Primary image generation service
- **Google Gemini**: Prompt enhancement and AI assistance
- **Flux Schnell Model**: Advanced image generation model

### Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Prisma Studio**: Database management interface
- **Turbopack**: Fast bundler for development

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication
- Nebius AI API key
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/lwshakib/aesthetic-ai-image-generation.git
cd aesthetic-ai-image-generation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aesthetic_ai_db"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# AI Services
NEBIUS_API_KEY=your_nebius_api_key
GEMINI_API_KEY=your_gemini_api_key

# Domain Configuration
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🏗️ Project Structure

```
aesthetic-ai-image-generation/
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration files
├── public/                   # Static assets
│   ├── favicon/             # Favicon files
│   ├── dark_logo.svg        # Dark theme logo
│   └── light_logo.svg       # Light theme logo
├── src/
│   ├── actions/             # Server actions
│   │   └── ai-related-tasks.ts  # AI generation logic
│   ├── app/                 # Next.js App Router
│   │   ├── (main)/          # Main application routes
│   │   │   ├── _components/ # Shared components
│   │   │   └── s/[subdomain]/ # Subdomain routes
│   │   │       ├── generate/   # Image generation page
│   │   │       ├── my-creations/ # User's generated images
│   │   │       ├── my-favorites/ # User's favorite images
│   │   │       └── plans/       # Subscription plans
│   │   ├── api/             # API routes
│   │   │   ├── generate-image/  # Image generation endpoint
│   │   │   ├── prompt/          # Prompt enhancement endpoint
│   │   │   └── user/            # User management endpoints
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Radix UI)
│   │   ├── footer.tsx       # Footer component
│   │   ├── landing-navbar.tsx # Landing page navigation
│   │   └── ...              # Other components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and configurations
│   │   ├── prisma.ts        # Prisma client configuration
│   │   ├── utils.ts         # Utility functions
│   │   └── checkuser.ts     # User validation utilities
│   ├── middleware.ts        # Next.js middleware
│   └── data/                # Static data files
└── package.json             # Dependencies and scripts
```

## 🎯 Usage

### Image Generation

1. **Navigate to Generate Page**: Access the image generation interface
2. **Enter Your Prompt**: Describe the image you want to create
3. **Enhance Prompt (Optional)**: Use AI to improve your prompt for better results
4. **Configure Parameters**:
   - **Dimensions**: Choose from preset sizes or set custom dimensions
   - **Inference Steps**: Control generation quality (1-10)
   - **Seed**: Set a specific seed for reproducible results
   - **Format**: Select PNG or JPG output
   - **Negative Prompt**: Specify what to avoid in the image
5. **Generate**: Click the generate button and watch your image come to life
6. **Download/Share**: Save or share your creation

### API Usage

The application provides a RESTful API for programmatic access:

```bash
# Generate an image
POST /api/generate-image
{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality",
  "width": 1024,
  "height": 1024,
  "seed": -1,
  "responseExt": "png",
  "numInferenceSteps": 4
}

# Enhance a prompt
POST /api/prompt
{
  "prompt": "A cat"
}
```

## 🔧 Configuration

### Database Models

The application uses three main database models:

- **User**: Stores user information, credits, and authentication data
- **Image**: Stores generated image metadata and URLs
- **Favorite**: Manages user's favorite images

### Environment Variables

Key environment variables for configuration:

| Variable                            | Description                       | Required |
| ----------------------------------- | --------------------------------- | -------- |
| `DATABASE_URL`                      | PostgreSQL connection string      | Yes      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key                  | Yes      |
| `CLERK_SECRET_KEY`                  | Clerk secret key                  | Yes      |
| `NEBIUS_API_KEY`                    | Nebius AI API key                 | Yes      |
| `GEMINI_API_KEY`                    | Google Gemini API key             | Yes      |
| `NEXT_PUBLIC_ROOT_DOMAIN`           | Your domain for subdomain routing | Yes      |

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add all required environment variables
3. **Deploy**: Vercel will automatically deploy your application

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Configure build settings for Next.js
- **Railway**: Use the provided Dockerfile
- **AWS/GCP**: Deploy using container services

### Database Deployment

- **Vercel Postgres**: Integrated PostgreSQL service
- **Supabase**: Managed PostgreSQL with additional features
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: Enterprise-grade database hosting

## 🤝 Contributing

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature or fix
4. **Test Thoroughly**: Ensure all functionality works correctly
5. **Submit a Pull Request**: Create a PR with detailed description

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and deployment platform
- **Clerk**: For authentication services
- **Nebius AI**: For image generation capabilities
- **Google**: For Gemini AI integration
- **Prisma**: For database toolkit
- **Radix UI**: For accessible UI components

---

_Transform your imagination into reality with the power of AI_
