import { cookiesClient } from '@/lib/server-client';
import { getBreadcrumbData } from '@/lib/breadcrumb';

export default async function Page() {
  console.log('=== Starting test-faithful page ===');
  
  // 1つのページ表示で複数のGraphQLクエリを実行
  const spaceId = 'test-space-id';
  
  console.log('Calling Space.get...');
  const space = await cookiesClient.models.Space.get({ id: spaceId });
  console.log('Space.get completed');
  
  console.log('Calling StorageItem.list...');
  const items = await cookiesClient.models.StorageItem.list();
  console.log('StorageItem.list completed, count:', items.data.length);
  
  console.log('Calling getBreadcrumbData...');
  const breadcrumb = await getBreadcrumbData('test-item-id'); // 内部で再帰的にStorageItem.get()を複数回実行
  console.log('getBreadcrumbData completed, levels:', breadcrumb.length);
  
  console.log('=== test-faithful page completed ===');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Faithful Reproduction Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          連続実行（リロード）
        </button>
        <p style={{ fontSize: '12px', color: '#666' }}>
          このボタンを素早く連続でクリックして、フォルダ間の素早い移動を再現
        </p>
      </div>
      <div>
        <h2>Space</h2>
        <pre>{JSON.stringify(space.data, null, 2)}</pre>
      </div>
      <div>
        <h2>Items (Total: {items.data.length})</h2>
        <pre>{JSON.stringify(items.data, null, 2)}</pre>
      </div>
      <div>
        <h2>Breadcrumb (Levels: {breadcrumb.length})</h2>
        <pre>{JSON.stringify(breadcrumb, null, 2)}</pre>
      </div>
    </div>
  );
}
