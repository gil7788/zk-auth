'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProviderCard from '@/components/ProviderCard';
import {
  saveProvider,
  clearProviders,
  getAllProviders,
} from '@/utils/providerStorage';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [storedProviders, setStoredProviders] = useState<
    Record<string, { user: any; token: string }>
  >({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    const current: Record<string, { user: any; token: string }> = {};
    if (session?.accessToken && session.user) {
      providers.forEach((provider) => {
        const isLinked =
          session.user?.email?.includes(provider.key) ||
          session.user?.image?.includes(provider.key);

        if (isLinked) {
          const providerData = {
            key: provider.key,
            user: session.user,
            token: session.accessToken || '',
          };
          saveProvider(providerData);
          current[provider.key] = {
            user: providerData.user,
            token: providerData.token,
          };
        }
      });
    }

    const fromStorage = getAllProviders();
    setStoredProviders({ ...fromStorage, ...current });
  }, [session]);

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const providers = [
    { name: 'Google', key: 'google', icon: '/google.svg' },
    { name: 'Discord', key: 'discord', icon: '/discord.svg' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Linked Services</h1>

        <div className="space-y-4 mb-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.key}
              provider={provider}
              isLinked={!!storedProviders[provider.key]}
              user={storedProviders[provider.key]?.user}
              token={storedProviders[provider.key]?.token}
            />
          ))}
        </div>

        <button
          onClick={() => {
            clearProviders();
            setStoredProviders({});
            signOut();
          }}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5 w-full"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
