'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import liff from '@line/liff';
import { liffConfig } from '../config';

interface LiffContextType {
  liff: typeof liff | null;
  liffError: string | null;
  isLoggedIn: boolean;
  profile: any | null;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  isLoggedIn: false,
  profile: null,
});

export function LiffProvider({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: '2006378265-BDywaPL9' });
        setLiffObject(liff);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const profile = await liff.getProfile();
          setProfile(profile);
        }
      } catch (error) {
        console.error('LIFF initialization failed', error);
        setLiffError(
          error instanceof Error
            ? error.toString()
            : 'An unknown error occurred'
        );
      }
    };

    initLiff();
  }, []);

  return (
    <LiffContext.Provider
      value={{ liff: liffObject, liffError, isLoggedIn, profile }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export function useLiff() {
  return useContext(LiffContext);
}
