'use client';

import { useState } from 'react';
import { useLiff } from '@/components/LINEProvider';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  const { liff, liffError, isLoggedIn, profile } = useLiff();
  const [message, setMessage] = useState<string>('');

  if (liffError) return <p>Something went wrong: {liffError}</p>;
  if (!liff) return <p>Loading...</p>;

  const handleLogin = () => {
    liff.login();
  };

  const handleLogout = () => {
    liff.logout();
    window.location.reload();
  };

  const sendMessage = () => {
    if (liff.isInClient() && message) {
      liff
        .sendMessages([{ type: 'text', text: message }])
        .then(() => {
          setMessage('');
          alert('Message sent');
        })
        .catch((error: any) => {
          console.error('Error sending message:', error);
        });
    }
  };

  return (
    <section className="bg-gray-900 text-white">
      <div>
        <h1>LIFF App</h1>
        {JSON.stringify(profile)}
        {isLoggedIn ? (
          <>
            <p>Welcome, {profile?.displayName}</p>
            <button onClick={handleLogout}>Logout</button>
            {liff.isInClient() && (
              <div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send Message</button>
              </div>
            )}

            <button type="button" onClick={() => router.push('/dashboard')}>
              Dashboard
            </button>
          </>
        ) : (
          <button onClick={handleLogin}>Login with LINE</button>
        )}
      </div>
      );
    </section>
    // <div>
    //   <h1>LIFF App</h1>
    // {JSON.stringify(profile)}
    // {isLoggedIn ? (
    //   <>
    //     <p>Welcome, {profile?.displayName}</p>
    //     {JSON.stringify(liff.isInClient())}
    //     <button onClick={handleLogout}>Logout</button>

    //     <div>
    //       <input
    //         type="text"
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         placeholder="Type a message"
    //       />
    //       <button onClick={sendMessage}>Send Message</button>
    //     </div>
    //   </>
    // ) : (
    //   <button onClick={handleLogin}>Login with LINE</button>
    // )}
    // </div>
  );
}
