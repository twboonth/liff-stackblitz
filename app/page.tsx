'use client';

import { useState } from 'react';
import { useLiff } from '@/components/LINEProvider';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  const { liff, liffError, isLoggedIn, profile } = useLiff();
  const [message, setMessage] = useState<string>('');
  const [scan, setScan] = useState<any>();


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

  const scanCode = async () => {
    const result = await liff.scanCodeV2();
    // result.value.userId = 'U41f97bf219a08c644dfcb04486258725';
    let datashow = result.value;
    setScan(result.value);
    console.log(datashow);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', 'https://express-line.vercel.app/dataQR');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(datashow);
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
            {/* Base */}


            {/* Border */}

            <button
              className="inline-block rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
              onClick={() => router.push('/dashboard')}
            >
              Download
            </button>
           
            <button onClick={scanCode} className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              >scanCode</button><br />
            -------------------\\//--------------
            {JSON.stringify(scan)}
          </>
        ) : (
          <button onClick={handleLogin}>Login with LINE</button>
        )}
      </div>

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
