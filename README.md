# GitFreeDocify - AI-Powered Documentation Generator

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-green)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful AI-driven platform that automatically generates professional documentation for GitHub repositories. Similar to gitdocify.com, this tool analyzes your codebase and creates comprehensive README files and project documentation in seconds.

## 🚀 Features

- **🤖 AI-Powered Analysis**: Uses Google Gemini Pro to analyze code structure and generate documentation
- **🔗 GitHub Integration**: Seamless OAuth integration with GitHub for repository access
- **⚡ Lightning Fast**: Generate professional READMEs in seconds
- **🎨 Beautiful UI**: Modern, responsive interface built with Tailwind CSS
- **📊 Multi-Language Support**: Supports all programming languages and frameworks
- **💾 Project Management**: Save and manage all your generated documentation
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔒 Secure**: OAuth authentication with secure token handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **NextAuth.js** - Authentication solution

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Modern database toolkit
- **SQLite** - Lightweight database (easily swappable)
- **Google Gemini Pro** - AI-powered content generation
- **GitHub API** - Repository analysis via Octokit

### Core Libraries
- **@octokit/rest** - GitHub API client
- **openai** - OpenAI API integration
- **zod** - TypeScript-first schema validation
- **react-hook-form** - Form handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gitfreedocify.git
   cd gitfreedocify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment variables in `.env.local`:**
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # GitHub OAuth (Create at https://github.com/settings/applications/new)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Google Gemini API (Get from https://makersuite.google.com/app/apikey)
   GEMINI_API_KEY="your-gemini-api-key"
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### GitHub OAuth App
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - **Application name**: GitFreeDocify
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret to your `.env.local`

### 2. Get Google Gemini API Key:
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign up or log in with your Google account
- Create a new API key
- Copy it to your `.env.local` file

## 📖 Usage

### Basic Usage
1. **Sign in** with your GitHub account
2. **Navigate** to the Generate page
3. **Enter** a GitHub repository URL
4. **Click** "Generate Documentation"
5. **Review** and download your README.md

### API Endpoints

#### Generate Documentation
```typescript
POST /api/generate
{
  "githubUrl": "https://github.com/owner/repository"
}
```

#### Get Projects
```typescript
GET /api/projects
```

#### Create/Update Project
```typescript
POST /api/projects
{
  "githubUrl": "https://github.com/owner/repo",
  "name": "Repository Name",
  "description": "Repository description",
  "language": "TypeScript",
  "githubId": "owner/repo",
  "readmeContent": "Generated README content"
}
```

## 🏗️ Project Structure

```
gitfreedocify/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── generate/     # Documentation generation
│   │   │   └── projects/     # Project management
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── generate/         # Generation interface
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── providers.tsx     # App providers
│   ├── lib/                  # Utility libraries
│   │   ├── ai-service.ts     # AI integration
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── prisma.ts         # Database client
│   └── types/                # TypeScript definitions
├── .env.example              # Environment variables template
├── .env.local                # Local environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔒 Security Features

- **OAuth Authentication**: Secure GitHub integration
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Request sanitization with Zod
- **Rate Limiting**: GitHub API rate limit handling
- **Token Security**: Secure token storage and handling

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic CI/CD

### Docker
```dockerfile
# Dockerfile included for containerized deployment
docker build -t gitfreedocify .
docker run -p 3000:3000 gitfreedocify
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📈 Roadmap

- [ ] **Full Code Documentation** - Generate comprehensive API docs
- [ ] **Multiple Export Formats** - Support for various documentation formats
- [ ] **Team Collaboration** - Multi-user project management
- [ ] **Custom Templates** - Customizable documentation templates
- [ ] **Integration Plugins** - VS Code and other editor extensions
- [ ] **Analytics Dashboard** - Usage statistics and insights

## 🐛 Known Issues

- Large repositories may take longer to analyze
- GitHub API rate limits may affect usage
- Some private repositories may require additional permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **GitHub** for the comprehensive API
- **Vercel** for hosting and deployment
- **Next.js** team for the amazing framework

## 📞 Support

- **Documentation**: [View full docs](https://gitfreedocify.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/gitfreedocify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gitfreedocify/discussions)

---

<div align="center">
  <strong>⭐ If you find this project useful, please give it a star on GitHub! ⭐</strong>
</div>
