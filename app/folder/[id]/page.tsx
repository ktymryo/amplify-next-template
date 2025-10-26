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
  
  let currentFolder;
  let children;
  let breadcrumb: string[] = [];
  
  if (id === 'root') {
    // ルート表示
    currentFolder = { data: { id: 'root', name: 'Root', parentId: null } };
    children = await cookiesClient.models.StorageItem.list({
      filter: { parentId: { attributeExists: false } }
    });
  } else {
    // 通常のフォルダ
    currentFolder = await cookiesClient.models.StorageItem.get({ id });
    children = await cookiesClient.models.StorageItem.listStorageItemByParentId({ parentId: id });
    breadcrumb = await getBreadcrumbData(id);
  }
  
  // 全フォルダ一覧を取得（サイドバー用）
  const allFolders = await cookiesClient.models.StorageItem.list();
  
  console.log(`=== Folder loaded: ${children.data.length} items ===`);

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif' }}>
      {/* サイドバー - 全フォルダ一覧 */}
      <div style={{ width: '250px', padding: '20px', background: '#f5f5f5', borderRight: '2px solid #ddd', minHeight: '100vh' }}>
        <h3>📂 All Folders</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '5px' }}>
            <Link href="/folder/root" style={{ color: '#0066cc', textDecoration: 'none' }}>
              🏠 Root
            </Link>
          </li>
          {allFolders.data.map((folder) => (
            <li key={folder.id} style={{ marginBottom: '5px' }}>
              <Link 
                href={`/folder/${folder.id}`}
                style={{ 
                  color: folder.id === id ? '#ff6600' : '#0066cc',
                  textDecoration: 'none',
                  fontWeight: folder.id === id ? 'bold' : 'normal'
                }}
              >
                📁 {folder.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, padding: '20px' }}>
      <h1>📁 Folder Browser</h1>
      
      {/* パンくずリスト */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <Link href="/folder/root" style={{ color: '#0066cc' }}>🏠 Root</Link>
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
        {id !== 'root' && !currentFolder.data?.parentId && (
          <Link 
            href="/folder/root"
            style={{ color: '#0066cc', textDecoration: 'none' }}
          >
            ⬆️ ルートへ
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
    </div>
  );
}
