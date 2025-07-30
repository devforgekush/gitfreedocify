import { z } from 'zod'

// GitHub URL validation schema
export const githubUrlSchema = z.string()
  .url('Must be a valid URL')
  .regex(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/, 'Must be a valid GitHub repository URL')
  .transform(url => url.replace(/\/$/, '')) // Remove trailing slash

// Project creation schema
export const projectSchema = z.object({
  githubUrl: githubUrlSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  language: z.string().max(50, 'Language must be less than 50 characters').optional(),
  githubId: z.string().min(1, 'GitHub ID is required').max(100, 'GitHub ID must be less than 100 characters'),
  readmeContent: z.string().max(50000, 'README content is too large').optional(),
})

// Input sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000) // Limit length
}

export function sanitizeGithubUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'github.com') {
      throw new Error('Invalid GitHub URL')
    }
    return parsed.toString().replace(/\/$/, '')
  } catch {
    throw new Error('Invalid URL format')
  }
}

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>()

  return function isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const userRequests = requests.get(identifier) || []
    
    // Filter out old requests
    const validRequests = userRequests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return true
    }
    
    validRequests.push(now)
    requests.set(identifier, validRequests)
    return false
  }
}
