"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProviderCard from "@/components/ProviderCard"
import { saveProvider, clearProviders, getAllProviders } from "@/utils/providerStorage"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [storedProviders, setStoredProviders] = useState<Record<string, { user: any; token: string }>>({})

  const providers = [
    { name: "Google", key: "google"},
    { name: "Discord", key: "discord"},
    { name: "GitHub", key: "github"},
    { name: "LinkedIn", key: "linkedin"},
    { name: "Facebook", key: "facebook"},
    { name: "Apple", key: "apple"},
  ]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status])

  useEffect(() => {
    const current: Record<string, { user: any; token: string }> = {}
    if (session?.accessToken && session.user) {
      providers.forEach((provider) => {
        const isLinked = session.user?.email?.includes(provider.key) || session.user?.image?.includes(provider.key)

        if (isLinked) {
          const providerData = {
            key: provider.key,
            user: session.user,
            token: session.accessToken || "",
          }
          saveProvider(providerData)
          current[provider.key] = {
            user: providerData.user,
            token: providerData.token,
          }
        }
      })
    }

    const fromStorage = getAllProviders()
    setStoredProviders({ ...fromStorage, ...current })
  }, [session])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Linked Services</h1>
          <p className="mt-2 text-gray-600">Manage your connected authentication providers</p>
          {session?.user && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
              {session.user.image && (
                <img src={session.user.image || "/placeholder.svg"} alt="Profile" className="h-6 w-6 rounded-full" />
              )}
              <span className="text-sm font-medium text-blue-900">
                Welcome, {session.user.name || session.user.email}
              </span>
            </div>
          )}
        </div>

        {/* Provider Cards */}
        <div className="space-y-3">
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

        {/* Sign Out Section */}
        <div className="pt-6 space-y-4">
          <div className="border-t border-gray-200"></div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your session and connected services</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    clearProviders()
                    setStoredProviders({})
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 hover:border-orange-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear All Links
                </button>

                <button
                  onClick={() => {
                    clearProviders()
                    setStoredProviders({})
                    signOut()
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:border-red-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {Object.keys(storedProviders).length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-blue-700">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">
                  {Object.keys(storedProviders).length} service{Object.keys(storedProviders).length !== 1 ? "s" : ""}{" "}
                  connected
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Your accounts are securely linked and ready to use</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
