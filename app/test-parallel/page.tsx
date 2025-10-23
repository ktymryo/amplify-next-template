import { cookiesClient } from '@/lib/server-client';

export default async function Page() {
  console.log('=== Starting parallel test ===');
  
  const spaceId = 'test-space-id';
  
  // 20個のStorageItem.get()を並列実行
  const promises = [];
  for (let i = 1; i <= 20; i++) {
    const itemId = i === 20 ? 'test-item-id' : `item-${i}`;
    promises.push(cookiesClient.models.StorageItem.get({ id: itemId }));
  }
  
  console.log('Executing 20 parallel queries...');
  const results = await Promise.all(promises);
  console.log('All queries completed');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Parallel Execution Test</h1>
      <p>20個のクエリを並列実行しました</p>
      <pre>{JSON.stringify({ count: results.length }, null, 2)}</pre>
    </div>
  );
}
