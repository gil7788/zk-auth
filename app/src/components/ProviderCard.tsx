"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { IdentityInfo } from "./IdentityInfo"

type Props = {
  provider: { name: string; key: string }
  isLinked: boolean
  user?: any
  token?: string
}

export default function ProviderCard({ provider, isLinked, user, token }: Props) {
  const [isLinking, setIsLinking] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleLink = async () => {
    setIsLinking(true)
    try {
      await signIn(provider.key, { callbackUrl: "/protected" })
    } catch (error) {
      console.error("Failed to link provider:", error)
    } finally {
      setIsLinking(false)
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md ${
        isLinked
          ? "border-green-200 bg-green-50/50 hover:border-green-300"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isLinked ? "bg-green-100" : "bg-gray-100"
            }`}
          >
          </div>

          {/* Provider Info */}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{provider.name}</span>
            {isLinked && <span className="text-sm text-gray-600">Connected</span>}
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex items-center gap-2">
          {isLinked ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Linked
              </span>
              {user && token && (
                <button 
                  onClick={() => setShowDetails(!showDetails)} 
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  {showDetails ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.415-1.414M14.12 14.12l1.415 1.415M14.12 14.12L15.535 15.535M14.12 14.12l1.414 1.414" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleLink}
              disabled={isLinking}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLinking ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Linking...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Link
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {isLinked && user && token && showDetails && (
        <div className="border-t border-green-200 bg-green-25 p-4">
          <IdentityInfo providerKey={provider.key} user={user} token={token} />
        </div>
      )}

      {/* Subtle connecting line for linked state */}
      {isLinked && <div className="absolute left-0 top-0 h-full w-1 bg-green-500" />}
    </div>
  )
}
