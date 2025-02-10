/**
 * Validates required environment variables
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME',
    'NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME'
  ] as const;
  
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate API_URL format
  try {
    new URL(process.env.NEXT_PUBLIC_API_URL ?? '');
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_API_URL format: ${process.env.NEXT_PUBLIC_API_URL}`);
  }
}

/**
 * Get the API URL based on environment
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5050';
}

/**
 * Get the Azure Storage configuration
 */
export function getAzureConfig() {
  return {
    accountName: process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME ?? '',
    containerName: process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME ?? '',
  };
}

/**
 * Get the maximum file size in bytes
 */
export function getMaxFileSize(): number {
  return Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 500 * 1024 * 1024; // 500MB default
} 