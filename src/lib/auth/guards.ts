export function requireRole(userRole: string | null, allowed: string[]) {
  return !!userRole && allowed.includes(userRole);
}
