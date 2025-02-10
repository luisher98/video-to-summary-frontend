import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ValidationError {
  message: string;
}

export function validateVideoFile(file: File): ValidationError | null {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  if (!allowedTypes.includes(file.type)) {
    return {
      message: 'Invalid file type. Please upload an MP4, WebM, or QuickTime video.'
    };
  }

  if (file.size > maxSize) {
    return {
      message: `File is too large. Maximum size is ${formatBytes(maxSize)}.`
    };
  }

  return null;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
