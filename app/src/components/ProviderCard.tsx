'use client';
import { signIn } from 'next-auth/react';
import { IdentityInfo } from './IdentityInfo';

type Props = {
  provider: { name: string; key: string; icon: string };
  isLinked: boolean;
  user?: any;
  token?: string;
};

export default function ProviderCard({ provider, isLinked, user, token }: Props) {
  return (
    <div className="flex flex-col border px-4 py-3 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
      {isLinked && user && token && (
        <IdentityInfo providerKey={provider.key} user={user} token={token} />
      )}
    </div>
  );
}
