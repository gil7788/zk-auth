"use client"
import { useState } from "react"

type Props = {
  providerKey: string
  user: any
  token: string
}

export function IdentityInfo({ providerKey, user, token }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const truncateToken = (token: string, length = 20) => {
    if (token.length <= length) return token
    return `${token.substring(0, length)}...${token.substring(token.length - 8)}`
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Account Details</h4>

      <div className="space-y-2">
        {/* User Email */}
        {user?.email && (
          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-200">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <svg
                className="h-4 w-4 text-gray-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(user.email, "email")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {copiedField === "email" ? (
                <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* User Name */}
        {user?.name && (
          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-200">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <svg
                className="h-4 w-4 text-gray-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(user.name, "name")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {copiedField === "name" ? (
                <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Access Token */}
        <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-200">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Access Token</p>
              <p className="text-sm font-mono text-gray-900 truncate">{truncateToken(token)}</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(token, "token")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {copiedField === "token" ? (
              <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
