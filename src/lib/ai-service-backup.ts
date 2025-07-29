import { GoogleGenerativeAI } from '@google/generative-ai'
import { Octokit } from '@octokit/rest'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface RepoAnalysis {
  name: string
  owner: string
  description?: string
  language: string
  languages: string[]
  structure: FileStructure[]
  dependencies: string[]
  packageJson?: Record<string, unknown>
  hasTests: boolean
  hasDocumentation: boolean
  frameworks: string[]
  features: string[]
  repoStats: {
    stars?: number
    forks?: number
    issues?: number
    size?: number
    defaultBranch?: string
  }
}

export interface FileStructure {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  content?: string
}

export class GitHubAnalyzer {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async analyzeRepository(owner: string, repo: string): Promise<RepoAnalysis> {
    try {
      // Get repository information
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      })

      // Get languages
      const { data: languages } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      })

      // Get repository contents
      const { data: contents } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: '',
      })

      // Ensure contents is an array
      const contentsArray = Array.isArray(contents) ? contents : [contents]

      // Analyze file structure
      const structure = await this.analyzeFileStructure(owner, repo, contentsArray)
      
      // Extract dependencies
      const dependencies = await this.extractDependencies(owner, repo)

      // Check for tests and documentation
      const hasTests = structure.some(file => 
        file.name.includes('test') || 
        file.name.includes('spec') ||
        file.path.includes('/test/') ||
        file.path.includes('/__tests__/')
      )

      const hasDocumentation = structure.some(file =>
        file.name.toLowerCase().includes('readme') ||
        file.name.toLowerCase().includes('doc') ||
        file.path.includes('/docs/')
      )

      return {
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description || '',
        language: repoData.language || 'Unknown',
        languages: Object.keys(languages),
        structure,
        dependencies,
        hasTests,
        hasDocumentation,
        frameworks: this.detectFrameworks(dependencies, structure),
        features: this.extractFeatures(structure, dependencies),
        repoStats: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          size: repoData.size,
          defaultBranch: repoData.default_branch
        }
      }
    } catch (error) {
      console.error('Error analyzing repository:', error)
      throw new Error('Failed to analyze repository')
    }
  }

  private async analyzeFileStructure(
    owner: string,
    repo: string,
    contents: Record<string, unknown>[]
  ): Promise<FileStructure[]> {
    const structure: FileStructure[] = []
    
    for (const item of contents.slice(0, 50)) { // Limit to first 50 items
      // Type guards for GitHub API response
      if (typeof item.type !== 'string' || typeof item.name !== 'string' || typeof item.path !== 'string') {
        continue
      }

      if (item.type === 'file' && typeof item.size === 'number' && item.size < 10000) { // Only analyze small files
        try {
          const { data: fileContent } = await this.octokit.repos.getContent({
            owner,
            repo,
            path: item.path,
          })

          if ('content' in fileContent && typeof fileContent.content === 'string') {
            structure.push({
              name: item.name,
              path: item.path,
              type: 'file',
              size: item.size,
              content: Buffer.from(fileContent.content, 'base64').toString('utf-8'),
            })
          }
        } catch {
          // Skip files that can't be read
          structure.push({
            name: item.name,
            path: item.path,
            type: 'file',
            size: item.size,
          })
        }
      } else {
        structure.push({
          name: item.name,
          path: item.path,
          type: item.type as 'file' | 'directory',
        })
      }
    }

    return structure
  }

  private async extractDependencies(owner: string, repo: string): Promise<string[]> {
    const dependencies: string[] = []

    try {
      // Try to get package.json
      const { data: packageJson } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      })

      if ('content' in packageJson) {
        const content = Buffer.from(packageJson.content, 'base64').toString('utf-8')
        const pkg = JSON.parse(content)
        dependencies.push(...Object.keys(pkg.dependencies || {}))
        dependencies.push(...Object.keys(pkg.devDependencies || {}))
      }
    } catch (error) {
      // Try requirements.txt for Python
      try {
        const { data: requirements } = await this.octokit.repos.getContent({
          owner,
          repo,
          path: 'requirements.txt',
        })

        if ('content' in requirements) {
          const content = Buffer.from(requirements.content, 'base64').toString('utf-8')
          const deps = content.split('\n').filter(line => line.trim() && !line.startsWith('#'))
          dependencies.push(...deps)
        }
      } catch (error) {
        // No dependencies file found
      }
    }

    return dependencies
  }

  private detectFrameworks(dependencies: string[], structure: FileStructure[]): string[] {
    const frameworks: string[] = []
    
    // Check dependencies for frameworks
    const frameworkMap: { [key: string]: string } = {
      'react': 'React',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'svelte': 'Svelte',
      'next': 'Next.js',
      'nuxt': 'Nuxt.js',
      'gatsby': 'Gatsby',
      'express': 'Express.js',
      'fastify': 'Fastify',
      'nestjs': 'NestJS',
      'django': 'Django',
      'flask': 'Flask',
      'spring': 'Spring Boot',
      'laravel': 'Laravel',
      'rails': 'Ruby on Rails',
      'flutter': 'Flutter',
      'ionic': 'Ionic'
    }

    dependencies.forEach(dep => {
      Object.keys(frameworkMap).forEach(key => {
        if (dep.toLowerCase().includes(key)) {
          frameworks.push(frameworkMap[key])
        }
      })
    })

    // Check file structure for framework indicators
    structure.forEach(file => {
      if (file.path.includes('package.json') || file.path.includes('composer.json') || 
          file.path.includes('requirements.txt') || file.path.includes('Gemfile')) {
        // Framework detection based on config files
      }
    })

    return [...new Set(frameworks)] // Remove duplicates
  }

  private extractFeatures(structure: FileStructure[], dependencies: string[]): string[] {
    const features: string[] = []
    
    // API features
    if (structure.some(f => f.path.includes('api/') || f.path.includes('routes/'))) {
      features.push('RESTful API')
    }
    
    // Database features
    if (dependencies.some(d => ['mongoose', 'sequelize', 'prisma', 'typeorm'].includes(d.toLowerCase()))) {
      features.push('Database Integration')
    }
    
    // Authentication
    if (dependencies.some(d => ['passport', 'jwt', 'auth0', 'firebase-auth'].includes(d.toLowerCase()))) {
      features.push('Authentication System')
    }
    
    // Testing
    if (dependencies.some(d => ['jest', 'mocha', 'cypress', 'playwright'].includes(d.toLowerCase()))) {
      features.push('Comprehensive Testing')
    }
    
    // UI/Frontend
    if (dependencies.some(d => ['tailwind', 'bootstrap', 'material-ui', 'styled-components'].includes(d.toLowerCase()))) {
      features.push('Modern UI/UX')
    }
    
    // Performance
    if (dependencies.some(d => ['webpack', 'vite', 'rollup', 'esbuild'].includes(d.toLowerCase()))) {
      features.push('Optimized Performance')
    }
    
    // Real-time features
    if (dependencies.some(d => ['socket.io', 'ws', 'socketcluster'].includes(d.toLowerCase()))) {
      features.push('Real-time Communication')
    }

    return features
  }
}

export class DocumentationGenerator {
  async generateREADME(analysis: RepoAnalysis): Promise<string> {
    const prompt = `
Generate an absolutely STUNNING, modern, and professional README.md file for a GitHub repository. This should be the most beautiful README that makes developers excited to contribute!

Repository Analysis:
- Name: ${analysis.name}
- Description: ${analysis.description}
- Primary Language: ${analysis.language}
- All Languages: ${analysis.languages.join(', ')}
- Frameworks: ${analysis.frameworks.join(', ') || 'None detected'}
- Key Features: ${analysis.features.join(', ') || 'General purpose'}
- Has Tests: ${analysis.hasTests}
- Has Documentation: ${analysis.hasDocumentation}
- Repository Stats: ${analysis.repoStats.stars} stars, ${analysis.repoStats.forks} forks, ${analysis.repoStats.issues} issues
- Dependencies: ${analysis.dependencies.slice(0, 15).join(', ')}

File Structure:
${analysis.structure.slice(0, 20).map(file => `- ${file.path} (${file.type})`).join('\n')}

Create a VISUALLY STUNNING README.md following these ADVANCED requirements:

## 🎨 VISUAL DESIGN:
1. **Hero Section**: Eye-catching header with gradient-style text, compelling tagline
2. **Animated Badges**: Use dynamic shields.io badges with custom colors
3. **Tech Stack Showcase**: Beautiful grid of technology badges
4. **Visual Dividers**: Use ASCII art, emojis, and creative separators
5. **Interactive Elements**: Clickable badges, collapsible sections
6. **Color Scheme**: Consistent color theme throughout

## 📋 ENHANCED STRUCTURE:
1. **🏆 Hero Banner**: Project logo area + title + subtitle + key stats
2. **✨ Highlights**: Key features with icons and short descriptions  
3. **🚀 Quick Start**: One-click installation and usage
4. **🛠️ Tech Stack**: Beautiful badge grid organized by category
5. **📖 Documentation**: Comprehensive usage guide with examples
6. **🎯 Features**: Detailed feature list with screenshots/GIFs mentions
7. **📁 Project Structure**: Visual file tree
8. **🔧 Configuration**: Setup and configuration options
9. **🧪 Testing**: How to run tests and contribute
10. **📈 Roadmap**: Future plans and version history
11. **🤝 Contributing**: Detailed contribution guidelines
12. **📄 License & Credits**: Legal and acknowledgments

## 🎨 ADVANCED STYLING:
- Use **bold**, *italic*, and \`code\` formatting extensively
- Add colorful dividers: \`---\` with emoji headers
- Create tables with proper alignment
- Use nested lists and checkboxes
- Add warning/info/success blockquotes
- Include collapsible details sections
- Use different badge styles (for-the-badge, flat-square, plastic)

## 🏷️ PREMIUM BADGES:
Create these badge categories:
**Status Badges:**
- ![Build Status](https://img.shields.io/github/workflow/status/owner/repo/CI?style=for-the-badge)
- ![License](https://img.shields.io/github/license/owner/repo?style=for-the-badge&color=blue)
- ![Version](https://img.shields.io/github/v/release/owner/repo?style=for-the-badge&color=green)

**Social Badges:**
- ![GitHub stars](https://img.shields.io/github/stars/owner/repo?style=social)
- ![GitHub forks](https://img.shields.io/github/forks/owner/repo?style=social)
- ![GitHub watchers](https://img.shields.io/github/watchers/owner/repo?style=social)

**Tech Stack Badges (for each detected technology):**
- ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
- ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📝 EXAMPLE PREMIUM FORMAT:
\`\`\`markdown
<div align="center">

# 🚀 ${analysis.name.toUpperCase()}

### *✨ Empowering Innovation, Accelerating Digital Success ✨*

[![GitHub Stars](https://img.shields.io/github/stars/owner/repo?style=for-the-badge&logo=github&color=yellow)](https://github.com/owner/repo/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/owner/repo?style=for-the-badge&logo=github&color=blue)](https://github.com/owner/repo/network)
[![GitHub Issues](https://img.shields.io/github/issues/owner/repo?style=for-the-badge&logo=github&color=red)](https://github.com/owner/repo/issues)
[![GitHub License](https://img.shields.io/github/license/owner/repo?style=for-the-badge&color=green)](https://github.com/owner/repo/blob/main/LICENSE)

---

### 🛠️ **Built With Cutting-Edge Technologies**

![Tech Stack](https://skillicons.dev/icons?i=js,ts,react,nodejs,python,docker,git)

</div>

## 🌟 **Highlights**

> 🎯 **Mission**: [Project mission here]  
> ⚡ **Performance**: Lightning-fast execution  
> 🔒 **Security**: Enterprise-grade security  
> 🌐 **Cross-platform**: Works everywhere  

## 🚀 **Quick Start**

\`\`\`bash
# 📦 Installation
npm install package-name

# ⚡ Quick Usage  
npm start

# 🎉 You're ready to go!
\`\`\`
\`\`\`

## 💎 ADVANCED FEATURES TO INCLUDE:
1. **ASCII Art Headers**: Use text art for section dividers
2. **Progress Bars**: Show completion status with emoji bars
3. **Feature Matrix**: Comparison tables with checkmarks
4. **Code Examples**: Multiple language examples with syntax highlighting
5. **Screenshot Placeholders**: Mention where screenshots would go
6. **Interactive Demos**: Links to live demos or CodeSandbox
7. **Performance Metrics**: Speed/size badges if applicable
8. **Compatibility Matrix**: Browser/OS support tables

## 🎭 CREATIVE ELEMENTS:
- Use Unicode symbols and emojis creatively: ▲ ▼ ◆ ★ ⭐ 🎨 🔥 💎 ⚡ 🚀
- Add "Back to Top" links: [⬆️ Back to Top](#top)
- Create expandable sections with <details> tags
- Use gradient-style headers with special characters
- Add motivational quotes or project philosophy

## 🚫 IMPORTANT RESTRICTIONS:
- **NO PLACEHOLDER TEXT**: Never use "YOUR_USERNAME", "YOUR_EMAIL@example.com", or similar placeholders
- **NO GENERIC NOTES**: Do not add notes about "Remember to replace..." or "You'll need to create..."
- **USE ACTUAL DATA**: Use the repository owner's actual GitHub username: ${analysis.owner}
- **REAL CONTACT**: For contact sections, use the repository owner's GitHub profile link or the repository's issue tracker
- **NO FAKE INFORMATION**: Only include information that can be derived from the actual repository data

## 📞 CONTACT SECTION FORMAT:
Use this exact format for contact information:
\`\`\`markdown
## 📞 Contact & Support

- 🐛 **Issues**: [Report bugs or request features](https://github.com/${analysis.owner}/${analysis.name}/issues)
- 👨‍💻 **Author**: [@${analysis.owner}](https://github.com/${analysis.owner})
- ⭐ **Show Support**: Give this project a star if you found it helpful!
\`\`\`

Generate the most beautiful, comprehensive, and engaging README possible. Make it so stunning that developers immediately want to star the repository and contribute!`

    // Retry logic for API calls
    const maxRetries = 3
    const baseDelay = 1000 // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return text || 'Failed to generate README'
      } catch (error: unknown) {
        console.error(`Attempt ${attempt} failed:`, error)
        
        // Check if it's a service unavailable error
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorStatus = (error as { status?: number })?.status
        
        if (errorStatus === 503 || errorMessage.includes('overloaded')) {
          if (attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
            console.log(`Service overloaded. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          } else {
            throw new Error('Gemini API is currently overloaded. Please try again in a few minutes.')
          }
        }
        
        // For other errors, don't retry
        throw new Error(`Failed to generate README: ${errorMessage}`)
      }
    }
    
    throw new Error('Failed to generate README after all retry attempts')
  }

  async generateProjectLogo(projectName: string, _description: string): Promise<string> {
    // This would integrate with DALL-E for logo generation
    // For now, we'll return a placeholder
    return `https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=${projectName.charAt(0).toUpperCase()}`
  }
}
