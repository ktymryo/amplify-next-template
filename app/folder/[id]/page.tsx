import { cookiesClient } from '@/lib/server-client';
import { getBreadcrumbData } from '@/lib/breadcrumb';
import Link from 'next/link';

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  console.log(`=== Loading folder: ${id} ===`);
  
  // 現在のフォルダ情報を取得
  const currentFolder = await cookiesClient.models.StorageItem.get({ id });
  
  // 子フォルダ一覧を取得
  const children = await cookiesClient.models.StorageItem.list({
    filter: { parentId: { eq: id } }
  });
  
  // パンくずリストを取得（再帰的にStorageItem.get()を複数回実行）
  const breadcrumb = await getBreadcrumbData(id);
  
  console.log(`=== Folder loaded: ${breadcrumb.length} levels ===`);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📁 Folder Browser</h1>
      
      {/* パンくずリスト */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <Link href="/folder/item-1" style={{ color: '#0066cc' }}>🏠 Root</Link>
        {breadcrumb.map((name, i) => (
          <span key={i}> / {name}</span>
        ))}
      </div>

      {/* 現在のフォルダ */}
      <div style={{ marginBottom: '20px' }}>
        <h2>{currentFolder.data?.name || 'Unknown'}</h2>
        {currentFolder.data?.parentId && (
          <Link 
            href={`/folder/${currentFolder.data.parentId}`}
            style={{ color: '#0066cc', textDecoration: 'none' }}
          >
            ⬆️ 上の階層へ
          </Link>
        )}
      </div>

      {/* 子フォルダ一覧 */}
      <div>
        <h3>フォルダ一覧 ({children.data.length}件)</h3>
        {children.data.length === 0 ? (
          <p style={{ color: '#666' }}>フォルダがありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {children.data.map((item) => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <Link 
                  href={`/folder/${item.id}`}
                  style={{ 
                    display: 'block',
                    padding: '10px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#333'
                  }}
                >
                  📁 {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
