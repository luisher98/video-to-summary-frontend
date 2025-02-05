/**
 * Validates required environment variables
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
  const requiredEnvVars = ['API_URL'] as const;
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Validate API_URL format
  try {
    new URL(process.env.API_URL);
  } catch (error) {
    throw new Error(`Invalid API_URL format: ${process.env.API_URL}`);
  }
}

/**
 * Gets the API URL with a fallback to localhost
 */
export function getApiUrl(): string {
  return process.env.API_URL ?? 'http://localhost:5050';
} 