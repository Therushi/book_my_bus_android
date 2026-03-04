/**
 * Simple password hashing for local-only storage.
 * NOT cryptographically secure — adequate for an offline demo app.
 * For production, use react-native-bcrypt or similar.
 */

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash).toString(36)}`;
};

export const verifyPassword = (
  password: string,
  storedHash: string,
): boolean => {
  return hashPassword(password) === storedHash;
};
