import { S3Client } from '@aws-sdk/client-s3';

// AWS Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
export const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || 'cdn.hv6.dev';

// Helper function to generate CDN URLs
export function generateCDNUrl(filePath: string, isImage: boolean = false): string {
  const basePath = isImage ? 'images' : 'files';
  // Remove leading slash from filePath if it exists to avoid double slashes
  const cleanFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return `https://${CLOUDFRONT_DOMAIN}/${basePath}/${cleanFilePath}`;
}
