import { cookiesClient } from '@/lib/server-client';

export default async function DebugPage() {
  let error = null;
  let result = null;
  
  try {
    result = await cookiesClient.models.Space.list();
  } catch (e: any) {
    error = e.message || String(e);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug</h1>
      {error && (
        <div>
          <h2>Error:</h2>
          <pre style={{ color: 'red' }}>{error}</pre>
        </div>
      )}
      {result && (
        <div>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
