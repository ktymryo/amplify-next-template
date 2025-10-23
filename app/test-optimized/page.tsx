import { generateServerClientUsingReqRes } from '@aws-amplify/adapter-nextjs/api';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { cookies } from 'next/headers';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

const { runWithAmplifyServerContext } = createServerRunner({ config: outputs });
const client = generateServerClientUsingReqRes<Schema>({ config: outputs });

export default async function TestOptimizedPage() {
  console.log('=== Starting multiple queries with single context ===');
  
  const queries = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      const results = [];
      
      // 同じコンテキスト内で10個のクエリを実行
      for (let i = 0; i < 10; i++) {
        console.log(`Query ${i + 1} starting...`);
        const result = await client.models.Todo.list(contextSpec);
        results.push(result);
        console.log(`Query ${i + 1} completed`);
      }
      
      return results;
    }
  });
  
  console.log('=== All queries completed ===');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test: Single Context (Optimized)</h1>
      <p>10個のクエリを1つのコンテキスト内で実行しました</p>
      <p>CloudTrailでAssumeRoleWithWebIdentityの呼び出し回数を確認してください</p>
      <pre>{JSON.stringify({ totalQueries: queries.length }, null, 2)}</pre>
    </div>
  );
}
