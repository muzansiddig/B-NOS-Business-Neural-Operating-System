// Simple password encryption utilities
// In production, use a proper cryptography library like TweetNaCl.js or libsodium.js

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function encryptData(data: string, key: string): string {
  try {
    return btoa(encodeURIComponent(data)); // Simple encoding for demo
  } catch {
    return data;
  }
}

export function decryptData(encrypted: string, key: string): string {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch {
    return encrypted;
  }
}
