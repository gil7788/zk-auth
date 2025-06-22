"use client"
import { useState } from "react"
import type React from "react"

type WalletFormData = {
  name: string
  type: "private_key" | "mnemonic"
  credential: string
}

type Props = {
  onAdd: (walletData: WalletFormData) => void
  onCancel: () => void
}

export default function AddWalletForm({ onAdd, onCancel }: Props) {
  const [formData, setFormData] = useState<WalletFormData>({
    name: "",
    type: "mnemonic",
    credential: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCredential, setShowCredential] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.credential.trim()) return

    setIsSubmitting(true)
    try {
      await onAdd(formData)
      setFormData({ name: "", type: "mnemonic", credential: "" })
    } catch (error) {
      console.error("Failed to add wallet:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add New Wallet</h3>
        <button
          onClick={onCancel}
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
              Never share your private keys or mnemonic phrases. This information is stored locally and encrypted.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Wallet Name */}
        <div>
          <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Name
          </label>
          <input
            type="text"
            id="walletName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onClick={() => setFormData({ ...formData, type: "mnemonic" })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.type === "mnemonic"
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
              onClick={() => setFormData({ ...formData, type: "private_key" })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.type === "private_key"
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
            {formData.type === "mnemonic" ? "Mnemonic Phrase" : "Private Key"}
          </label>
          <div className="relative">
            <textarea
              id="credential"
              value={formData.credential}
              onChange={(e) => setFormData({ ...formData, credential: e.target.value })}
              placeholder={
                formData.type === "mnemonic"
                  ? "Enter your 12 or 24 word mnemonic phrase..."
                  : "Enter your private key (0x...)..."
              }
              rows={formData.type === "mnemonic" ? 3 : 2}
              className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                !showCredential ? "font-mono text-transparent bg-gray-100" : "font-mono"
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
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.credential.trim()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Adding...
              </div>
            ) : (
              "Add Wallet"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
