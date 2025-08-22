// services/authService.ts
import * as SecureStore from "expo-secure-store";

const KEY = "session"; // one place to store user + tokens

export type User = {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export type Session = {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
};

// (optional) in-memory cache to avoid repeated JSON parsing
let cache: Session | null | undefined; // undefined = not loaded yet

async function load(): Promise<Session | null> {
  if (cache !== undefined) return cache;
  try {
    const available = await SecureStore.isAvailableAsync();
    if (!available) return (cache = null);

    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return (cache = null);

    const data = JSON.parse(raw);
    // Minimal shape check
    if (data?.user && data?.accessToken) return (cache = data as Session);
    // Corrupted? clear it
    await SecureStore.deleteItemAsync(KEY);
    return (cache = null);
  } catch {
    return (cache = null);
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const s = await load();
  return !!s?.user && !!s?.accessToken;
}

export async function getUser(): Promise<User | null> {
  const s = await load();
  return s?.user ?? null;
}

export async function getAccessToken(): Promise<string | null> {
  const s = await load();
  return s?.accessToken ?? null;
}

export async function setSession(session: Session): Promise<void> {
  cache = session;

  await SecureStore.setItemAsync(KEY, JSON.stringify(session));

}

export async function clearSession(): Promise<void> {
  cache = null;
  await SecureStore.deleteItemAsync(KEY);
}
