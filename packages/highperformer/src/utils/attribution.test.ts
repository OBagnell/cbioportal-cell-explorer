import { describe, it, expect } from 'vitest'
import { resolveAttribution, type CollectionAttribution } from './attribution'

const CRC: CollectionAttribution = {
  slug: 'crc-atlas',
  name: 'The single-cell Colorectal Cancer Atlas',
  publication_citation: 'Marteau, Nemati, Handler et al., Cancer Cell (2026)',
  publication_url: 'https://doi.org/10.1016/j.ccell.2025.12.003',
  license_name: 'CC BY 4.0',
  license_url: 'https://creativecommons.org/licenses/by/4.0/',
  source_url: 'https://doi.org/10.5281/zenodo.17878122',
  attribution_note: 'Converted from h5ad to zarr; no other changes.',
}

const catalog = [
  { slug: 'crc-core', url: 'https://cdn.example.org/crc_core.zarr', collection: CRC },
  { slug: 'plain', url: 'https://cdn.example.org/plain.zarr', collection: { slug: 'p', name: 'Plain' } },
  { slug: 'loose', url: 'https://cdn.example.org/loose.zarr', collection: null },
]

describe('resolveAttribution', () => {
  it('resolves by slug', () => {
    expect(resolveAttribution(catalog, { slug: 'crc-core', url: null })).toEqual(CRC)
  })

  it('resolves a direct url by matching the catalog url', () => {
    expect(resolveAttribution(catalog, { slug: null, url: 'https://cdn.example.org/crc_core.zarr' })).toEqual(CRC)
  })

  it('ignores a trailing slash difference', () => {
    expect(resolveAttribution(catalog, { slug: null, url: 'https://cdn.example.org/crc_core.zarr/' })).toEqual(CRC)
  })

  it('returns null for a url not in the catalog', () => {
    expect(resolveAttribution(catalog, { slug: null, url: 'https://elsewhere.org/x.zarr' })).toBeNull()
  })

  it('returns null when the dataset has no collection', () => {
    expect(resolveAttribution(catalog, { slug: 'loose', url: null })).toBeNull()
  })

  it('returns null when the collection has neither citation nor license (incl. an older backend)', () => {
    expect(resolveAttribution(catalog, { slug: 'plain', url: null })).toBeNull()
  })

  it('returns the collection when it has only a license', () => {
    const licenseOnly = { slug: 'l', name: 'Licensed', license_name: 'CC0 1.0' }
    expect(resolveAttribution([{ slug: 'x', url: null, collection: licenseOnly }], { slug: 'x', url: null })).toEqual(licenseOnly)
  })

  it('returns null for an empty catalog', () => {
    expect(resolveAttribution([], { slug: 'crc-core', url: 'https://cdn.example.org/crc_core.zarr' })).toBeNull()
  })
})
