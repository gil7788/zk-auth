'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { readHelloWorld } from "@/hooks/useVerifyJWT";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/protected');
  }, [session]);

  const handleRedirect = () => {
    window.location.href = '/api/auth/signin';
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/identity-zk.png"
          alt="Next.js logo"
          width={360}
          height={74}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by {' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              Authenticating
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">Link your digital identities and prove ownership without compramising your privacy.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={handleRedirect}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Sign in icon"
              width={20}
              height={20}
            />
            Sign in
          </button>

        </div>
      </main>
    </div>
  );
}
