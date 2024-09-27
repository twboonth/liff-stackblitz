'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import liff from '@line/liff/core';
import { liffConfig } from '../config';

import GetOS from '@line/liff/get-os'
import GetAppLanguage from '@line/liff/get-app-language'

import GetLineVersion from '@line/liff/get-line-version'
import GetContext from '@line/liff/get-context'
import IsInClient from '@line/liff/is-in-client'
import IsLoggedIn from '@line/liff/is-logged-in'
import IsApiAvailable from '@line/liff/is-api-available'
import Login from '@line/liff/login'
import Logout from '@line/liff/logout'
import GetAccesstoken from '@line/liff/get-access-token'
import GetIdToken from '@line/liff/get-id-token'
import GetDecodedIdToken from '@line/liff/get-decoded-id-token'

import Permission from '@line/liff/permission'
import GetProfile from '@line/liff/get-profile'
import GetFriendShip from '@line/liff/get-friendship'
import OpenWindow from '@line/liff/open-window'
import CloseWindow from '@line/liff/close-window'
import SendMessages from '@line/liff/send-messages'
import ShareTargetPicker from '@line/liff/share-target-picker'
import ScanCodeV2 from '@line/liff/scan-code-v2'


import PermanentLink from '@line/liff/permanent-link'
import i18n from '@line/liff/i18n'
import CreateShortcutOnHomeScreen from '@line/liff/create-shortcut-on-home-screen'
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
  liff.use(new GetOS());
  liff.use(new GetAppLanguage());
  liff.use(new GetLineVersion());
  liff.use(new GetContext());
  liff.use(new GetLineVersion());
  liff.use(new IsInClient()); 
  liff.use(new IsLoggedIn());
  liff.use(new IsApiAvailable()); 
  liff.use(new Login());
  liff.use(new Logout()); 
  liff.use(new GetAccesstoken());
  liff.use(new GetIdToken()); 
  liff.use(new GetDecodedIdToken());
  liff.use(new Permission()); 
  liff.use(new GetProfile());
  liff.use(new GetFriendShip()); 
  liff.use(new OpenWindow());
  liff.use(new CloseWindow()); 
  liff.use(new SendMessages());
  liff.use(new ShareTargetPicker());
  liff.use(new ScanCodeV2());

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
