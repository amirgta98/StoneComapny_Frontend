/**
 * Simulates network latency so loading states, disable/enable flows and
 * skeletons behave exactly as they will against the real API.
 *
 * MOCK-ONLY: deleted entirely during backend integration (skill §11.5).
 */
export function mockDelay(minMs = 300, maxMs = 900): Promise<void> {
  const ms = Math.floor(minMs + Math.random() * (maxMs - minMs));
  return new Promise((resolve) => setTimeout(resolve, ms));
}
