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

    // 1つのフォルダに100個のファイルを作成
    await cookiesClient.models.StorageItem.create({
      id: 'large-folder',
      name: 'Large Folder (100 files)',
      parentId: null,
    });

    for (let i = 0; i < 100; i++) {
      await cookiesClient.models.StorageItem.create({
        id: `file-${i}`,
        name: `file-${i}.txt`,
        parentId: 'large-folder',
      });
    }

    redirect('/test-faithful/setup');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Setup Test Data (1 folder with 100 files)</h1>
      <form>
        <input type="hidden" name="action" value="create" />
        <button type="submit">Create Test Data</button>
      </form>
    </div>
  );
}
