<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# GitDocify - AI-Powered Documentation Generator

## Project Overview
This is a Next.js application that generates professional documentation for GitHub repositories using AI. Similar to gitdocify.com, it analyzes codebases and creates comprehensive README files and documentation.

## Tech Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: Prisma with PostgreSQL/SQLite
- **AI Integration**: OpenAI API for code analysis and documentation generation
- **Deployment**: Vercel-ready

## Key Features to Implement
1. GitHub OAuth integration for repository access
2. AI-powered code analysis and README generation
3. Multi-language codebase support
4. Customizable documentation templates
5. Project logo generation
6. Markdown export functionality
7. User dashboard for managing generated docs
8. Pricing tiers and subscription management

## Coding Guidelines
- Use TypeScript strictly with proper type definitions
- Follow Next.js 15 App Router patterns
- Implement responsive design with Tailwind CSS
- Use server components where possible for better performance
- Implement proper error handling and loading states
- Add comprehensive logging for debugging
- Follow security best practices for API routes
- Use environment variables for sensitive data

## API Integration Patterns
- Use server actions for form submissions
- Implement proper rate limiting
- Add request validation and sanitization
- Use streaming for large responses
- Implement proper caching strategies
