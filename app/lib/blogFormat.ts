// Pure date helper — no filesystem imports, so it is safe to use from client
// components (unlike the rest of app/lib/blog.ts, which reads the filesystem).

// "2026-07-15" -> "July 15, 2026"
export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (!y || !m || !d) return iso;
  return `${months[m - 1]} ${d}, ${y}`;
}
