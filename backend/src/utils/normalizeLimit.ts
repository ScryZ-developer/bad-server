export default function normalizeLimit(
    limit: unknown,
    defaultLimit = 10,
    maxLimit = 10
): number {
    const parsed = Number(limit) || defaultLimit
    return Math.min(Math.max(parsed, 1), maxLimit)
}
