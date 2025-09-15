import { NextRequest, NextResponse } from 'next/server';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, generateCDNUrl } from '@/lib/aws-config';
import { validateAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  // Validate authentication
  const authResult = await validateAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { oldKey, newName, type } = await request.json();

    if (!oldKey || !newName) {
      return NextResponse.json({ error: 'Old key and new name are required' }, { status: 400 });
    }

    // Extract the directory path from the old key
    const pathParts = oldKey.split('/');
    const directory = pathParts.slice(0, -1).join('/');
    
    // Create new key with the new name
    const newKey = `${directory}/${newName}`;

    // Copy the object to the new key
    const copyCommand = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${oldKey}`,
      Key: newKey,
    });

    await s3Client.send(copyCommand);

    // Delete the old object
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: oldKey,
    });

    await s3Client.send(deleteCommand);

    // Generate new CDN URL
    const basePath = type === 'image' ? 'images' : 'files';
    const filePath = newKey.replace(`${basePath}/`, '');
    const cdnUrl = generateCDNUrl(filePath, type === 'image');

    return NextResponse.json({
      success: true,
      newKey: newKey,
      newUrl: cdnUrl,
      newName: newName,
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename file' },
      { status: 500 }
    );
  }
}
