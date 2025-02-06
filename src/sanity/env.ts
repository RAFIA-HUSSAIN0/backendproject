export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skacl9ZIuQHsPdBxTrh1ll4s4iODNVhS5mbgnYnl2FPGXquIHNaHZMyvydnzjFM65Sr7Zd9zhtiWC7byPZS3wHn6YXIgJanEaCBMcTymvgr8flWpMvEpFDbdDUCy0O5owVKg0tmEP05LFKDnqQxHDd0kEUbxlMrMHeNQQAnyvAPnxdt0erKc",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
