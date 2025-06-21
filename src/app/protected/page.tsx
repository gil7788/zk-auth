'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
  if (session?.accessToken) {
    console.log('Access session:', JSON.stringify(session, null ,2));
  }
}, [session]);


  if (status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const linkedAccounts = session?.user?.email ? session.user : {};


  const providers = [
    { name: 'Google', key: 'google', icon: '/google.svg' },
    { name: 'Discord', key: 'discord', icon: '/discord.svg' },
  ];

    function DiscordInfo({ user, token }: { user: any; token: string }) {
      console.log(`user: `, JSON.stringify(user));
      console.log(`token: `, JSON.stringify(token));
      return (
        <div className="mt-2 text-left text-sm text-gray-600">
          <p><strong>Discord Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.name}</p>
          <p><strong>Token (access):</strong> {token}</p>
        </div>
      );
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Linked Services</h1>

        <div className="space-y-4 mb-6">
          {providers.map((provider) => {
            // const isLinked = session?.user?.email?.toLowerCase().includes(provider.key);
            const isLinked = session?.user?.image?.includes(provider.key) || session?.user?.email?.includes(provider.key);

            return (
              <div
                key={provider.key}
                className="flex flex-col border px-4 py-3 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={provider.icon}
                      alt={provider.name}
                      width={24}
                      height={24}
                      className="dark:invert"
                    />
                    <span className="text-sm font-medium">{provider.name}</span>
                  </div>
                  {isLinked ? (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Linked
                    </span>
                  ) : (
                    <button
                      onClick={() => signIn(provider.key, { callbackUrl: '/protected' })}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                    >
                      Link
                    </button>
                  )}
                </div>

                {provider.key === 'discord' && isLinked && session?.user && (
                  <DiscordInfo user={session.user} token={session.accessToken || ""} />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => signOut()}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5 w-full"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
