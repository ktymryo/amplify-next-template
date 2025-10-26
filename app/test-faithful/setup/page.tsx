import { cookiesClient } from '@/lib/server-client';
import { redirect } from 'next/navigation';

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  const params = await searchParams;
  
  if (params.action === 'create') {
    // Space作成
    await cookiesClient.models.Space.create({
      id: 'test-space-id',
      name: 'Test Space',
    });

    // 3つのフォルダを作成し、各フォルダに30個のファイルを作成
    const folders = ['folder-a', 'folder-b', 'folder-c'];
    
    for (const folderId of folders) {
      await cookiesClient.models.StorageItem.create({
        id: folderId,
        name: `Folder ${folderId.split('-')[1].toUpperCase()} (30 files)`,
        parentId: null,
      });

      for (let i = 0; i < 30; i++) {
        await cookiesClient.models.StorageItem.create({
          id: `${folderId}-file-${i}`,
          name: `file-${i}.txt`,
          parentId: folderId,
        });
      }
    }

    redirect('/test-faithful/setup');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Setup Test Data (3 folders with 30 files each)</h1>
      <form>
        <input type="hidden" name="action" value="create" />
        <button type="submit">Create Test Data</button>
      </form>
    </div>
  );
}
