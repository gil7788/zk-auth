'use client';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const handleRedirect = () => {
    window.location.href = '/api/auth/signin';
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRedirect}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Go to Default Sign-In Page
      </button>
    </div>
  );
}
