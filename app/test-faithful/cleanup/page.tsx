import { cookiesClient } from '@/lib/server-client';
import { redirect } from 'next/navigation';

export default async function CleanupPage({
  searchParams,
}: {
  searchParams: { action?: string };
}) {
  if (searchParams.action === 'delete') {
    // 全StorageItem削除
    const items = await cookiesClient.models.StorageItem.list();
    for (const item of items.data) {
      await cookiesClient.models.StorageItem.delete({ id: item.id });
    }

    // Space削除
    await cookiesClient.models.Space.delete({ id: 'test-space-id' });

    redirect('/test-faithful/setup');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cleanup Test Data</h1>
      <form>
        <input type="hidden" name="action" value="delete" />
        <button type="submit">Delete All Test Data</button>
      </form>
    </div>
  );
}
