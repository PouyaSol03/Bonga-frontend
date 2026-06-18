export function getUserRole() {
  try {
    const session = localStorage.getItem("bonga-auth-session");
    if (!session) return null;
    const parsedSession = JSON.parse(session);
    const role = parsedSession?.role ?? null;
    return role;
  } catch {
    return null;
  }
}