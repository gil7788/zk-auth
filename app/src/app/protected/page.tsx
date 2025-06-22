"use client"

import type React from "react"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProviderCard from "@/components/ProviderCard"
import { saveProvider, clearProviders, getAllProviders } from "@/utils/providerStorage"

type Wallet = {
  id: string
  name: string
  type: "private_key" | "mnemonic"
  credential: string
  createdAt: string
}

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [storedProviders, setStoredProviders] = useState<Record<string, { user: any; token: string }>>({})
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [walletForm, setWalletForm] = useState({
    name: "",
    type: "mnemonic" as "private_key" | "mnemonic",
    credential: "",
  })
  const [showCredential, setShowCredential] = useState(false)

  const providers = [
    { name: "Google", key: "google", icon: "/google.svg" },
    { name: "Discord", key: "discord", icon: "/discord.svg" },
    { name: "GitHub", key: "github", icon: "/github.svg" },
    { name: "LinkedIn", key: "linkedin", icon: "/linkedin.svg" },
    { name: "Facebook", key: "facebook", icon: "/facebook.svg" },
    { name: "Apple", key: "apple", icon: "/apple.svg" },
  ]

  // Load wallets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("crypto_wallets")
    if (stored) {
      try {
        setWallets(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load wallets:", error)
      }
    }
  }, [])

  // Save wallets to localStorage whenever wallets change
  useEffect(() => {
    localStorage.setItem("crypto_wallets", JSON.stringify(wallets))
  }, [wallets])

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

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletForm.name.trim() || !walletForm.credential.trim()) return

    const newWallet: Wallet = {
      id: Date.now().toString(),
      name: walletForm.name,
      type: walletForm.type,
      credential: walletForm.credential,
      createdAt: new Date().toISOString(),
    }

    setWallets((prev) => [...prev, newWallet])
    setWalletForm({ name: "", type: "mnemonic", credential: "" })
    setShowAddWallet(false)
    setShowCredential(false)
  }

  const handleRemoveWallet = (id: string) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const truncateCredential = (credential: string) => {
    if (credential.length <= 20) return credential
    return `${credential.substring(0, 10)}...${credential.substring(credential.length - 10)}`
  }

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

        {/* Wallet Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Crypto Wallets</h2>
              <p className="text-sm text-gray-600">Manage your cryptocurrency wallets</p>
            </div>
            {!showAddWallet && (
              <button
                onClick={() => setShowAddWallet(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Wallet
              </button>
            )}
          </div>

          {/* Add Wallet Form */}
          {showAddWallet && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Wallet</h3>
                <button
                  onClick={() => {
                    setShowAddWallet(false)
                    setWalletForm({ name: "", type: "mnemonic", credential: "" })
                    setShowCredential(false)
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Security Warning */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <p className="text-amber-800 text-sm font-medium">Security Notice</p>
                    <p className="text-amber-700 text-xs mt-1">
                      This data is stored locally in your browser. Never share your private keys or mnemonic phrases.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddWallet} className="space-y-4">
                {/* Wallet Name */}
                <div>
                  <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    id="walletName"
                    value={walletForm.name}
                    onChange={(e) => setWalletForm({ ...walletForm, name: e.target.value })}
                    placeholder="e.g., My Main Wallet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Wallet Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWalletForm({ ...walletForm, type: "mnemonic" })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        walletForm.type === "mnemonic"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <svg className="h-6 w-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium">Mnemonic</p>
                        <p className="text-xs opacity-75">12/24 word phrase</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWalletForm({ ...walletForm, type: "private_key" })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        walletForm.type === "private_key"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <svg className="h-6 w-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                        <p className="text-sm font-medium">Private Key</p>
                        <p className="text-xs opacity-75">Hex string</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Credential Input */}
                <div>
                  <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-1">
                    {walletForm.type === "mnemonic" ? "Mnemonic Phrase" : "Private Key"}
                  </label>
                  <div className="relative">
                    <textarea
                      id="credential"
                      value={walletForm.credential}
                      onChange={(e) => setWalletForm({ ...walletForm, credential: e.target.value })}
                      placeholder={
                        walletForm.type === "mnemonic"
                          ? "Enter your 12 or 24 word mnemonic phrase..."
                          : "Enter your private key (0x...)..."
                      }
                      rows={walletForm.type === "mnemonic" ? 3 : 2}
                      className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono ${
                        !showCredential ? "text-transparent" : ""
                      }`}
                      style={!showCredential ? { textShadow: "0 0 8px rgba(0,0,0,0.5)" } : {}}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCredential(!showCredential)}
                      className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:text-gray-700"
                    >
                      {showCredential ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.415-1.414M14.12 14.12l1.415 1.415M14.12 14.12L15.535 15.535M14.12 14.12l1.414 1.414"
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddWallet(false)
                      setWalletForm({ name: "", type: "mnemonic", credential: "" })
                      setShowCredential(false)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!walletForm.name.trim() || !walletForm.credential.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Wallet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Wallet Cards */}
          {wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="group relative overflow-hidden rounded-xl border border-purple-200 bg-purple-50/50 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{wallet.name}</span>
                        <span className="text-sm text-gray-600 capitalize">{wallet.type.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Stored
                      </span>

                      <button
                        onClick={() => copyToClipboard(wallet.credential)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        title="Copy credential"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleRemoveWallet(wallet.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-100 hover:text-red-700"
                        title="Remove wallet"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Credential Preview */}
                  <div className="border-t border-purple-200 bg-purple-25 p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          {wallet.type === "mnemonic" ? "Mnemonic Phrase" : "Private Key"}
                        </p>
                        <p className="text-sm font-mono text-gray-900 truncate">
                          {truncateCredential(wallet.credential)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        Added {new Date(wallet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 h-full w-1 bg-purple-500" />
                </div>
              ))}
            </div>
          ) : !showAddWallet ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets stored</h3>
              <p className="text-gray-600 mb-4">Add your first crypto wallet to get started</p>
              <button
                onClick={() => setShowAddWallet(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Wallet
              </button>
            </div>
          ) : null}
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
                    localStorage.removeItem("crypto_wallets")
                    setWallets([])
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
                  Clear All Data
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
        {(Object.keys(storedProviders).length > 0 || wallets.length > 0) && (
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
                  {Object.keys(storedProviders).length} service{Object.keys(storedProviders).length !== 1 ? "s" : ""}
                  {wallets.length > 0 && ` and ${wallets.length} wallet${wallets.length !== 1 ? "s" : ""}`} stored
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Your data is stored locally in your browser</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
