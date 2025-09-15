import { NextRequest, NextResponse } from 'next/server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, generateCDNUrl } from '@/lib/aws-config';

export async function GET(request: NextRequest) {
  // Allow read access for everyone (no authentication required for listing)

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'file';
    const prefix = searchParams.get('prefix') || '';

    const basePath = type === 'image' ? 'images' : 'files';
    // Clean up prefix to avoid double slashes
    const cleanPrefix = prefix && prefix.trim() ? prefix.replace(/^\/+|\/+$/g, '') : '';
    const fullPrefix = cleanPrefix ? `${basePath}/${cleanPrefix}/` : `${basePath}/`;

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: fullPrefix,
      Delimiter: '/',
    });

    const response = await s3Client.send(command);

    const folders = (response.CommonPrefixes || [])
      .map(prefix => {
        const folderName = prefix.Prefix?.replace(fullPrefix, '').replace(/\/$/, '') || '';
        return {
          name: folderName,
          type: 'folder',
          path: prefix.Prefix || '',
        };
      })
      .filter(folder => folder.name && folder.name !== ''); // Filter out empty folder names

    const files = (response.Contents || [])
      .filter(obj => obj.Key && !obj.Key.endsWith('/') && obj.Key !== fullPrefix)
      .map(obj => {
        const fileName = obj.Key?.replace(fullPrefix, '') || '';
        const filePath = obj.Key?.replace(`${basePath}/`, '') || '';
        return {
          name: fileName,
          type: 'file',
          size: obj.Size || 0,
          lastModified: obj.LastModified,
          url: generateCDNUrl(filePath, type === 'image'),
          key: obj.Key,
        };
      });

    return NextResponse.json({
      success: true,
      folders,
      files,
      currentPath: prefix,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
