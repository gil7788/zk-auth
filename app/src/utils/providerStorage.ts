const STORAGE_KEY = 'linked_providers';

export type ProviderData = {
  key: string;
  user: any;
  token: string;
};

export function saveProvider(provider: ProviderData) {
  const existing = getAllProviders();
  const updated = {
    ...existing,
    [provider.key]: {
      user: provider.user,
      token: provider.token,
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getAllProviders(): Record<string, { user: any; token: string }> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function clearProviders() {
  localStorage.removeItem(STORAGE_KEY);
}
