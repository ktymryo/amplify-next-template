"use client";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Login</h1>
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <p>✅ Logged in as: {user?.signInDetails?.loginId}</p>
            <button onClick={signOut}>Sign out</button>
            <br /><br />
            <button onClick={() => router.push('/test')}>
              Go to Rate Limit Test
            </button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}
