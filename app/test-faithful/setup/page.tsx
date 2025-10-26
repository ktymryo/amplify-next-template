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

    // ルートフォルダ作成（3つ）
    await cookiesClient.models.StorageItem.create({
      id: 'root-1',
      name: 'Folder A',
      parentId: null,
    });
    await cookiesClient.models.StorageItem.create({
      id: 'root-2',
      name: 'Folder B',
      parentId: null,
    });
    await cookiesClient.models.StorageItem.create({
      id: 'root-3',
      name: 'Folder C',
      parentId: null,
    });

    // Folder Aの子フォルダ（3つ）
    await cookiesClient.models.StorageItem.create({
      id: 'a-1',
      name: 'Folder A-1',
      parentId: 'root-1',
    });
    await cookiesClient.models.StorageItem.create({
      id: 'a-2',
      name: 'Folder A-2',
      parentId: 'root-1',
    });
    await cookiesClient.models.StorageItem.create({
      id: 'a-3',
      name: 'Folder A-3',
      parentId: 'root-1',
    });

    // Folder Bの子フォルダ（3つ）
    await cookiesClient.models.StorageItem.create({
      id: 'b-1',
      name: 'Folder B-1',
      parentId: 'root-2',
    });
    await cookiesClient.models.StorageItem.create({
      id: 'b-2',
      name: 'Folder B-2',
      parentId: 'root-2',
    });
    await cookiesClient.models.StorageItem.create({
      id: 'b-3',
      name: 'Folder B-3',
      parentId: 'root-2',
    });

    redirect('/test-faithful/setup');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Setup Test Data (20 levels)</h1>
      <form>
        <input type="hidden" name="action" value="create" />
        <button type="submit">Create Test Data</button>
      </form>
    </div>
  );
}
