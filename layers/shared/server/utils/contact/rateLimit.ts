const WINDOW_MS = 60_000
const hits = new Map<string, number>()

export function isContactRateLimited(ip: string | undefined): boolean {
  if (!ip) {
    return false
  }

  const now = Date.now()
  const lastHit = hits.get(ip)

  if (lastHit && now - lastHit < WINDOW_MS) {
    return true
  }

  hits.set(ip, now)
  return false
}
