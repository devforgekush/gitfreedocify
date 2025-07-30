// Utility functions for GitHub OAuth with PKCE
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

export function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  return crypto.subtle.digest('SHA-256', data).then(hash => base64URLEncode(new Uint8Array(hash)))
}

function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function saveAuthState(codeVerifier: string, state: string) {
  sessionStorage.setItem('github_code_verifier', codeVerifier)
  sessionStorage.setItem('github_state', state)
}

export function getAuthState() {
  return {
    codeVerifier: sessionStorage.getItem('github_code_verifier'),
    state: sessionStorage.getItem('github_state')
  }
}

export function clearAuthState() {
  sessionStorage.removeItem('github_code_verifier')
  sessionStorage.removeItem('github_state')
}
