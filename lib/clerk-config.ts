// Clerk Configuration Utility
export const clerkConfig = {
  // Frontend API URL
  frontendApi: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || 'https://flying-penguin-12.clerk.accounts.dev',
  
  // Backend API URL
  apiUrl: process.env.CLERK_API_URL || 'https://api.clerk.com',
  
  // JWKS URL for JWT verification
  jwksUrl: process.env.CLERK_JWKS_URL || 'https://flying-penguin-12.clerk.accounts.dev/.well-known/jwks.json',
  
  // Public key for JWT verification
  jwksPublicKey: process.env.CLERK_JWKS_PUBLIC_KEY,
  
  // Publishable key (frontend)
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  
  // Secret key (backend only)
  secretKey: process.env.CLERK_SECRET_KEY,
} as const;

// Validate required environment variables
export function validateClerkConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_FRONTEND_API'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required Clerk environment variables:', missingVars);
    console.error('Please check your .env.local file and ensure all required variables are set.');
    return false;
  }
  
  return true;
}

// Get Clerk configuration for different environments
export function getClerkConfig() {
  if (!validateClerkConfig()) {
    throw new Error('Clerk configuration is incomplete. Please check your environment variables.');
  }
  
  return clerkConfig;
}

// Helper function to check if Clerk is properly configured
export function isClerkConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY &&
    process.env.NEXT_PUBLIC_CLERK_FRONTEND_API
  );
} 