// Utility functions for wallet storage
export type Wallet = {
  id: string
  name: string
  address: string
  type: "private_key" | "mnemonic"
  createdAt: string
  encryptedCredential: string // In a real app, this should be properly encrypted
}

const STORAGE_KEY = "linked_wallets"

// Simple encryption (in production, use proper encryption)
const simpleEncrypt = (text: string): string => {
  return btoa(text) // Base64 encoding - NOT secure for production
}

const simpleDecrypt = (encrypted: string): string => {
  return atob(encrypted) // Base64 decoding
}

// Generate wallet address from credential (simplified)
const generateAddress = (credential: string, type: "private_key" | "mnemonic"): string => {
  // This is a mock implementation - in reality, you'd use proper crypto libraries
  const hash = credential.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return `0x${Math.abs(hash).toString(16).padStart(40, "0")}`
}

export const saveWallet = (walletData: { name: string; type: "private_key" | "mnemonic"; credential: string }) => {
  const wallets = getAllWallets()
  const newWallet: Wallet = {
    id: Date.now().toString(),
    name: walletData.name,
    address: generateAddress(walletData.credential, walletData.type),
    type: walletData.type,
    createdAt: new Date().toISOString(),
    encryptedCredential: simpleEncrypt(walletData.credential),
  }

  wallets[newWallet.id] = newWallet
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets))
  return newWallet
}

export const getAllWallets = (): Record<string, Wallet> => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export const removeWallet = (walletId: string) => {
  const wallets = getAllWallets()
  delete wallets[walletId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets))
}

export const clearAllWallets = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getWalletCredential = (walletId: string): string | null => {
  const wallets = getAllWallets()
  const wallet = wallets[walletId]
  return wallet ? simpleDecrypt(wallet.encryptedCredential) : null
}
