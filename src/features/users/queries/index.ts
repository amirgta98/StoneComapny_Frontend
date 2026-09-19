import type { User } from "@/types";
import { mockUsers } from "@/lib/mock-data/users";

/**
 * User queries.
 *
 * These are server-side query functions. The actual database
 * implementation should be added when the backend is ready.
 */
export async function getUsers(): Promise<User[]> {
  // Using mock data for now. Replace with actual backend query when ready.
  return mockUsers;
}

export async function getUserById(id: string): Promise<User | null> {
  // TODO: Implement server-side user query.
  return mockUsers.find((u) => u.id === id) || null;
}

export async function getUsersByTenant(tenantId: string): Promise<User[]> {
  // TODO: Implement server-side tenant user query.
  return mockUsers.filter((u) => u.tenantId === tenantId);
}
