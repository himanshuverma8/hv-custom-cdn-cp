import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, generateCDNUrl } from '@/lib/aws-config';
import { validateAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  // Validate authentication
  const authResult = await validateAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const type = formData.get('type') as string; // 'image' or 'file'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine the base path based on file type
    const basePath = type === 'image' ? 'images' : 'files';
    // Only add folder to path if it's not empty
    const filePath = folder && folder.trim() ? `${folder}/${file.name}` : file.name;
    const key = `${basePath}/${filePath}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Generate CDN URL
    const cdnUrl = generateCDNUrl(filePath, type === 'image');

    return NextResponse.json({
      success: true,
      url: cdnUrl,
      key: key,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
