import { NextRequest, NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/lib/aws-config';
import { validateAuth } from '@/lib/auth-utils';

export async function DELETE(request: NextRequest) {
  // Validate authentication
  const authResult = await validateAuth();
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
