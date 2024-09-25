'use client';

import { useLiff } from '@/components/LINEProvider';

export default function Page() {
  const { liff, liffError, isLoggedIn, profile } = useLiff();

  return <>Dashboard {JSON.stringify(profile)}</>;
}
