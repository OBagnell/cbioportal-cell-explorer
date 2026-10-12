/**
 * License and credit for a collection, carried on each catalog dataset's
 * `collection`. Every attribution field is optional: an older backend omits them.
 */
export interface CollectionAttribution {
  slug: string
  name: string
  publication_citation?: string | null
  publication_url?: string | null
  license_name?: string | null
  license_url?: string | null
  source_url?: string | null
  attribution_note?: string | null
}

const trimSlash = (url: string) => url.replace(/\/+$/, '')

/**
 * Attribution for the open dataset: by catalog slug, else by matching the open
 * store URL against catalog URLs (direct `?url=` opens). Null when there is no
 * match, no collection, or nothing worth crediting (no citation and no license).
 */
export function resolveAttribution(
  catalog: ReadonlyArray<{ slug: string; url: string | null; collection?: CollectionAttribution | null }>,
  open: { slug: string | null; url: string | null },
): CollectionAttribution | null {
  let entry = open.slug ? catalog.find((d) => d.slug === open.slug) : undefined
  if (!entry && open.url) {
    const target = trimSlash(open.url)
    entry = catalog.find((d) => d.url != null && trimSlash(d.url) === target)
  }
  const collection = entry?.collection
  if (!collection) return null
  if (!collection.publication_citation && !collection.license_name) return null
  return collection
}
