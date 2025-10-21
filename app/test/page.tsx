import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export default async function TestPage() {
  console.log('Starting parallel queries...');
  
  try {
    // Execute 6 queries in parallel to exceed 5 RPS limit
    const results = await Promise.all([
      cookiesClient.models.Todo.list(),
      cookiesClient.models.Todo.list(),
      cookiesClient.models.Todo.list(),
      cookiesClient.models.Todo.list(),
      cookiesClient.models.Todo.list(),
      cookiesClient.models.Todo.list(),
    ]);
    
    console.log('All queries completed successfully');
    
    return (
      <div style={{ padding: '20px' }}>
        <h1>Rate Limit Test</h1>
        <p>✅ Successfully executed 6 parallel queries</p>
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
