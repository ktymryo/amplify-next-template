import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export default async function TestCookiesPage() {
  console.log('=== Starting multiple queries with cookiesClient ===');
  
  // 複数のクエリを順次実行（お客様のケースを再現）
  const queries = [];
  
  for (let i = 0; i < 10; i++) {
    console.log(`Query ${i + 1} starting...`);
    const result = await cookiesClient.models.Todo.list();
    queries.push(result);
    console.log(`Query ${i + 1} completed`);
  }
  
  console.log('=== All queries completed ===');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test: generateServerClientUsingCookies</h1>
      <p>10個のクエリを順次実行しました</p>
      <p>CloudTrailでAssumeRoleWithWebIdentityの呼び出し回数を確認してください</p>
      <pre>{JSON.stringify({ totalQueries: queries.length }, null, 2)}</pre>
    </div>
  );
}
