/**
 * Registration fees in LKR.
 * Safe to import in both client and server code.
 * Override via env vars (server-side only; use hardcoded defaults for the client).
 */
export const TICKET_PRICES: Record<string, number> = {
  "in-person": 15000,
  livestream: 5000,
};
