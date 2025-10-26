import { cookiesClient } from '@/lib/server-client';
import { redirect } from 'next/navigation';

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  const params = await searchParams;
  
  if (params.action === 'delete') {
    // 全StorageItemを削除
    const allItems = [];
    let token: string | null | undefined = undefined;
    
    const firstResponse = await cookiesClient.models.StorageItem.list();
    allItems.push(...firstResponse.data);
    token = firstResponse.nextToken;
    
    while (token) {
      const response = await cookiesClient.models.StorageItem.list({ nextToken: token });
      allItems.push(...response.data);
      token = response.nextToken;
    }

    for (const item of allItems) {
      await cookiesClient.models.StorageItem.delete({ id: item.id });
    }

    // 全Spaceを削除
    const { data: spaces } = await cookiesClient.models.Space.list();
    for (const space of spaces) {
      await cookiesClient.models.Space.delete({ id: space.id });
    }

    redirect('/test-faithful/setup');
  }
  
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
      <form style={{ marginBottom: '10px' }}>
        <input type="hidden" name="action" value="create" />
        <button type="submit">Create Test Data</button>
      </form>
      <form>
        <input type="hidden" name="action" value="delete" />
        <button type="submit" style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete All Data</button>
      </form>
    </div>
  );
}
