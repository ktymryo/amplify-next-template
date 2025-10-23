import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

export default async function TestPage() {
  const cookiesClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });

  console.log('Starting parallel queries...');
  
  try {
    // Execute 20 queries in parallel to test rate limits
    const queries = Array(20).fill(null).map(() => cookiesClient.models.Todo.list());
    const results = await Promise.all(queries);
    
    console.log('All queries completed successfully');
    
    return (
      <div style={{ padding: '20px' }}>
        <h1>Rate Limit Test</h1>
        <p>✅ Successfully executed 20 parallel queries</p>
        <p>Total results: {results.reduce((acc, r) => acc + (r.data?.length || 0), 0)}</p>
      </div>
    );
  } catch (error) {
    console.error('Error occurred:', error);
    
    return (
      <div style={{ padding: '20px' }}>
        <h1>Rate Limit Test</h1>
        <p>❌ Error occurred:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
