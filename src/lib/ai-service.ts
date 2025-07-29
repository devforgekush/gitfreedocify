import { GoogleGenerativeAI } from '@google/generative-ai'
import { Mistral } from '@mistralai/mistralai'
import { Octokit } from '@octokit/rest'

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

interface AIProvider {
  name: string
  generateREADME: (analysis: RepoAnalysis) => Promise<string>
}

class GeminiProvider implements AIProvider {
  name = 'Gemini'
  private genAI: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateREADME(analysis: RepoAnalysis): Promise<string> {
    const prompt = this.createPrompt(analysis)
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  private createPrompt(analysis: RepoAnalysis): string {
    return `You are a world-class technical writer creating stunning GitHub README files. Generate an absolutely beautiful, comprehensive, and professional README.md for this repository:

## 📊 REPOSITORY ANALYSIS:
- **Name**: ${analysis.name}
- **Owner**: ${analysis.owner}
- **Description**: ${analysis.description || 'No description provided'}
- **Primary Language**: ${analysis.language}
- **Languages Used**: ${analysis.languages.join(', ')}
- **Dependencies**: ${analysis.dependencies.join(', ')}
- **Frameworks Detected**: ${analysis.frameworks.join(', ')}
- **Key Features**: ${analysis.features.join(', ')}
- **Has Tests**: ${analysis.hasTests ? 'Yes' : 'No'}
- **Has Documentation**: ${analysis.hasDocumentation ? 'Yes' : 'No'}
- **Repository Stats**: ${analysis.repoStats.stars || 0} stars, ${analysis.repoStats.forks || 0} forks

## 🎯 README REQUIREMENTS:
Create a README that includes ALL of these sections with beautiful formatting:

### 1. **HEADER SECTION** 
- Eye-catching title with emojis
- Stunning project logo placeholder or ASCII art
- Compelling one-liner description
- Beautiful badge collection (build status, version, license, etc.)

### 2. **VISUAL SHOWCASE**
- Screenshot placeholders with descriptive text
- GIF demo placeholder descriptions
- Feature highlights with icons

### 3. **QUICK START SECTION**
- One-command installation
- Simple usage example
- "Get started in 30 seconds" approach

### 4. **DETAILED FEATURES**
- Comprehensive feature list with emojis
- Feature comparison table if applicable
- Unique selling points

### 5. **INSTALLATION & SETUP**
- Multiple installation methods
- Prerequisites clearly listed
- Step-by-step setup guide
- Environment configuration

### 6. **USAGE EXAMPLES**
- Basic usage with code examples
- Advanced usage scenarios
- API documentation if applicable
- Configuration options

### 7. **DEVELOPMENT SETUP**
- Local development guide
- Testing instructions
- Build commands
- Contributing workflow

### 8. **ARCHITECTURE & DESIGN**
- Project structure explanation
- Design decisions
- Technical overview

### 9. **CONTRIBUTING**
- How to contribute
- Code of conduct reference
- Development guidelines

### 10. **SUPPORT & COMMUNITY**
- Contact information
- Support channels
- Community guidelines

### 11. **LICENSE & CREDITS**
- License information
- Acknowledgments
- Credits to contributors

## 🎨 FORMATTING GUIDELINES:
- Use plenty of emojis and visual elements
- Create beautiful section dividers
- Use tables, lists, and code blocks effectively
- Add "Back to Top" navigation links
- Use GitHub-flavored Markdown features
- Make it mobile-friendly

## 💡 CREATIVE TOUCHES:
- Add motivational quotes or project philosophy
- Use creative ASCII art or Unicode symbols
- Include fun facts about the project
- Add progress indicators for roadmap items
- Use expandable details sections

## 🚫 CRITICAL RULES:
- NEVER use placeholder text like "YOUR_USERNAME" or "your-email@example.com"
- ALWAYS use the actual repository owner: ${analysis.owner}
- ALWAYS use the actual repository name: ${analysis.name}
- For contact, use: https://github.com/${analysis.owner}/${analysis.name}/issues
- Make everything specific to this actual repository

Generate the most stunning README that will make developers immediately want to star and contribute to this project!`
  }
}

class MistralProvider implements AIProvider {
  name = 'Mistral'
  private client: Mistral

  constructor(apiKey: string) {
    this.client = new Mistral({ apiKey })
  }

  async generateREADME(analysis: RepoAnalysis): Promise<string> {
    const prompt = this.createPrompt(analysis)
    
    const response = await this.client.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.choices[0].message.content
    return typeof content === 'string' ? content : 'Failed to generate documentation'
  }

  private createPrompt(analysis: RepoAnalysis): string {
    return `You are an expert technical writer. Create a beautiful, comprehensive README.md for this GitHub repository:

Repository: ${analysis.name} by ${analysis.owner}
Description: ${analysis.description || 'No description provided'}
Primary Language: ${analysis.language}
Languages: ${analysis.languages.join(', ')}
Dependencies: ${analysis.dependencies.join(', ')}
Frameworks: ${analysis.frameworks.join(', ')}
Features: ${analysis.features.join(', ')}
Has Tests: ${analysis.hasTests}
Stars: ${analysis.repoStats.stars || 0}
Forks: ${analysis.repoStats.forks || 0}

Create a professional README with:
1. Attractive header with title and badges
2. Project description and features
3. Installation instructions
4. Usage examples with code
5. Development setup guide
6. Contributing guidelines
7. License and contact information

Use proper Markdown formatting, emojis, and make it visually appealing. 
NEVER use placeholder text - use actual repository details: ${analysis.owner}/${analysis.name}
For contact, use: https://github.com/${analysis.owner}/${analysis.name}/issues`
  }
}

export class GitHubAnalyzer {
  private octokit: Octokit
  private aiProviders: AIProvider[] = []

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })

    // Initialize AI providers with fallback support
    const geminiKey = process.env.GEMINI_API_KEY
    const mistralKey = process.env.MISTRAL_API_KEY

    if (geminiKey) {
      this.aiProviders.push(new GeminiProvider(geminiKey))
    }
    
    if (mistralKey) {
      this.aiProviders.push(new MistralProvider(mistralKey))
    }

    if (this.aiProviders.length === 0) {
      throw new Error('No AI providers configured. Please set GEMINI_API_KEY or MISTRAL_API_KEY.')
    }

    console.log(`🤖 AI Providers initialized: ${this.aiProviders.map(p => p.name).join(', ')}`)
  }

  async analyzeRepository(owner: string, repo: string): Promise<RepoAnalysis> {
    try {
      // Get repository information
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      })

      // Get repository languages
      const { data: languages } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      })

      // Get repository tree to understand structure
      const { data: tree } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: repoData.default_branch,
        recursive: 'true',
      })

      // Analyze file structure
      const structure = this.analyzeFileStructure(tree.tree)
      
      // Detect dependencies and frameworks
      const dependencies = await this.detectDependencies(owner, repo)
      const frameworks = this.detectFrameworks(structure, dependencies)
      const features = this.detectFeatures(structure, dependencies)

      // Check for tests and documentation
      const hasTests = this.hasTests(structure)
      const hasDocumentation = this.hasDocumentation(structure)

      // Get package.json if it exists
      let packageJson: Record<string, unknown> | undefined
      try {
        const { data: packageFile } = await this.octokit.repos.getContent({
          owner,
          repo,
          path: 'package.json',
        })
        if ('content' in packageFile) {
          packageJson = JSON.parse(Buffer.from(packageFile.content, 'base64').toString())
        }
      } catch {
        // package.json doesn't exist
      }

      const primaryLanguage = Object.keys(languages)[0] || 'Unknown'
      const languageList = Object.keys(languages)

      return {
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description || undefined,
        language: primaryLanguage,
        languages: languageList,
        structure,
        dependencies,
        packageJson,
        hasTests,
        hasDocumentation,
        frameworks,
        features,
        repoStats: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          size: repoData.size,
          defaultBranch: repoData.default_branch,
        },
      }
    } catch (error) {
      console.error('Error analyzing repository:', error)
      throw new Error('Failed to analyze repository')
    }
  }

  async generateREADME(analysis: RepoAnalysis): Promise<string> {
    let lastError: Error | null = null

    // Try each AI provider in order
    for (const provider of this.aiProviders) {
      try {
        console.log(`🤖 Trying ${provider.name} AI for README generation...`)
        const result = await provider.generateREADME(analysis)
        console.log(`✅ ${provider.name} AI successful!`)
        return result
      } catch (error) {
        console.error(`❌ ${provider.name} AI failed:`, error instanceof Error ? error.message : error)
        lastError = error instanceof Error ? error : new Error(String(error))
        continue
      }
    }

    // If all providers failed, throw the last error
    throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  private analyzeFileStructure(tree: Array<{type: string, path?: string, size?: number}>): FileStructure[] {
    const filteredTree = tree
      .filter(item => item.type === 'blob' || item.type === 'tree')
      .map(item => ({
        name: item.path?.split('/').pop() || item.path || '',
        path: item.path || '',
        type: (item.type === 'blob' ? 'file' : 'directory') as 'file' | 'directory',
        size: item.size,
      }))
      .slice(0, 50) // Limit to first 50 items
    
    return filteredTree
  }

  private async detectDependencies(owner: string, repo: string): Promise<string[]> {
    const dependencies: string[] = []

    try {
      // Check package.json
      const { data: packageFile } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      })
      if ('content' in packageFile) {
        const packageJson = JSON.parse(Buffer.from(packageFile.content, 'base64').toString())
        if (packageJson.dependencies) {
          dependencies.push(...Object.keys(packageJson.dependencies))
        }
        if (packageJson.devDependencies) {
          dependencies.push(...Object.keys(packageJson.devDependencies))
        }
      }
    } catch {
      // package.json doesn't exist
    }

    try {
      // Check requirements.txt
      const { data: reqFile } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'requirements.txt',
      })
      if ('content' in reqFile) {
        const requirements = Buffer.from(reqFile.content, 'base64').toString()
        const deps = requirements.split('\n').filter(line => line.trim() && !line.startsWith('#'))
        dependencies.push(...deps.map(dep => dep.split('==')[0].split('>=')[0].trim()))
      }
    } catch {
      // requirements.txt doesn't exist
    }

    return [...new Set(dependencies)].slice(0, 20) // Remove duplicates and limit
  }

  private detectFrameworks(structure: FileStructure[], dependencies: string[]): string[] {
    const frameworks: string[] = []

    // Check for framework indicators in dependencies
    const frameworkMap: Record<string, string> = {
      'react': 'React',
      'next': 'Next.js',
      'vue': 'Vue.js',
      'nuxt': 'Nuxt.js',
      'angular': 'Angular',
      'express': 'Express.js',
      'fastapi': 'FastAPI',
      'django': 'Django',
      'flask': 'Flask',
      'spring': 'Spring',
      'rails': 'Ruby on Rails',
      'laravel': 'Laravel',
      'tailwindcss': 'Tailwind CSS',
      'bootstrap': 'Bootstrap',
      'prisma': 'Prisma',
      'mongoose': 'Mongoose',
      'sequelize': 'Sequelize',
    }

    dependencies.forEach(dep => {
      Object.keys(frameworkMap).forEach(key => {
        if (dep.toLowerCase().includes(key)) {
          frameworks.push(frameworkMap[key])
        }
      })
    })

    // Check for framework indicators in file structure
    const hasNextConfig = structure.some(file => file.name === 'next.config.js' || file.name === 'next.config.ts')
    const hasViteConfig = structure.some(file => file.name === 'vite.config.js' || file.name === 'vite.config.ts')
    const hasAngularJson = structure.some(file => file.name === 'angular.json')

    if (hasNextConfig) frameworks.push('Next.js')
    if (hasViteConfig) frameworks.push('Vite')
    if (hasAngularJson) frameworks.push('Angular')

    return [...new Set(frameworks)]
  }

  private detectFeatures(structure: FileStructure[], dependencies: string[]): string[] {
    const features: string[] = []

    // API features
    if (structure.some(file => file.path.includes('api/') || file.path.includes('routes/'))) {
      features.push('REST API')
    }

    // Database features
    if (dependencies.some(dep => ['prisma', 'mongoose', 'sequelize', 'typeorm'].includes(dep.toLowerCase()))) {
      features.push('Database Integration')
    }

    // Authentication
    if (dependencies.some(dep => ['nextauth', 'passport', 'auth0'].includes(dep.toLowerCase()))) {
      features.push('Authentication')
    }

    // Testing
    if (this.hasTests(structure)) {
      features.push('Automated Testing')
    }

    // TypeScript
    if (structure.some(file => file.name?.endsWith('.ts') || file.name?.endsWith('.tsx'))) {
      features.push('TypeScript Support')
    }

    // Docker
    if (structure.some(file => file.name === 'Dockerfile' || file.name === 'docker-compose.yml')) {
      features.push('Docker Support')
    }

    // CI/CD
    if (structure.some(file => file.path.includes('.github/workflows/'))) {
      features.push('CI/CD Pipeline')
    }

    return features
  }

  private hasTests(structure: FileStructure[]): boolean {
    return structure.some(file => 
      file.path.includes('test/') || 
      file.path.includes('tests/') || 
      file.path.includes('__tests__/') ||
      file.name?.includes('.test.') ||
      file.name?.includes('.spec.')
    )
  }

  private hasDocumentation(structure: FileStructure[]): boolean {
    return structure.some(file => 
      file.name?.toLowerCase() === 'readme.md' ||
      file.path.includes('docs/') ||
      file.path.includes('documentation/')
    )
  }

  async generateProjectLogo(projectName: string, _description: string): Promise<string> {
    // This would integrate with DALL-E for logo generation
    // For now, we'll return a placeholder
    return `https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=${projectName.charAt(0).toUpperCase()}`
  }

  getAvailableProviders(): string[] {
    return this.aiProviders.map(p => p.name)
  }
}
