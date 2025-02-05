import { z } from 'zod';

export const youtubeUrlSchema = z
  .string()
  .url()
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === 'youtube.com' ||
        parsedUrl.hostname === 'www.youtube.com' ||
        parsedUrl.hostname === 'youtu.be'
      );
    } catch {
      return false;
    }
  }, 'Must be a valid YouTube URL');

export const wordCountSchema = z
  .number()
  .int()
  .positive()
  .max(1000, 'Maximum word count is 1000')
  .or(z.string().regex(/^\d+$/).transform(Number)); 