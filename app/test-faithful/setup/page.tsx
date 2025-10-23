import { cookiesClient } from '@/lib/server-client';
import { redirect } from 'next/navigation';

export default async function SetupPage({
  searchParams,
}: {
  searchParams: { action?: string };
}) {
  if (searchParams.action === 'create') {
    // Space作成
    await cookiesClient.models.Space.create({
      id: 'test-space-id',
      name: 'Test Space',
    });

    // 20階層のStorageItem作成
    let parentId: string | null = null;
    for (let i = 1; i <= 20; i++) {
      const itemId = i === 20 ? 'test-item-id' : `item-${i}`;
      await cookiesClient.models.StorageItem.create({
        id: itemId,
        name: `Item Level ${i}`,
        parentId: parentId,
      });
      parentId = itemId;
    }

    redirect('/test-faithful');
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
