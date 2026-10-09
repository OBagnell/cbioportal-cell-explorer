import type { CSSProperties } from 'react'
import { Popover } from 'antd'
import { Link } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import { resolveAttribution, type CollectionAttribution } from '../utils/attribution'

const ext = { target: '_blank', rel: 'noreferrer' } as const

const lineStyle: CSSProperties = {
  position: 'absolute',
  right: 8,
  bottom: 8,
  zIndex: 2,
  maxWidth: '60%',
  padding: '2px 7px',
  fontSize: 11,
  color: '#555',
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid #e5e5e5',
  borderRadius: 4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const rowLabel: CSSProperties = { color: '#888', display: 'inline-block', width: 56 }

function Details({ a }: { a: CollectionAttribution }) {
  return (
    <div style={{ maxWidth: 340, fontSize: 12, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.name}</div>
      {a.publication_citation && (
        <div>
          <span style={rowLabel}>Cite</span>
          {a.publication_url ? <a href={a.publication_url} {...ext}>{a.publication_citation} ↗</a> : a.publication_citation}
        </div>
      )}
      {a.license_name && (
        <div>
          <span style={rowLabel}>License</span>
          {a.license_url ? <a href={a.license_url} {...ext}>{a.license_name} ↗</a> : a.license_name}
        </div>
      )}
      {a.source_url && (
        <div>
          <span style={rowLabel}>Source</span>
          <a href={a.source_url} {...ext}>{a.source_url.replace(/^https?:\/\//, '')}</a>
        </div>
      )}
      {a.attribution_note && (
        <div>
          <span style={rowLabel}>Note</span>
          <span style={{ color: '#555' }}>{a.attribution_note}</span>
        </div>
      )}
      <div style={{ marginTop: 4, fontSize: 11 }}>
        <Link to={`/collections/${a.slug}`}>View collection →</Link>
      </div>
    </div>
  )
}

/** Map-style data credit in the plot corner; renders nothing without attribution. */
export default function AttributionCredit() {
  const catalog = useAppStore((s) => s.catalogDatasets)
  const slug = useAppStore((s) => s.datasetSlug)
  const url = useAppStore((s) => s.datasetUrl)
  const a = resolveAttribution(catalog, { slug, url })
  if (!a) return null

  return (
    <div style={lineStyle}>
      Data:{' '}
      {a.publication_citation ? (
        a.publication_url ? <a href={a.publication_url} {...ext}>{a.publication_citation}</a> : a.publication_citation
      ) : (
        <span>{a.name}</span>
      )}
      {a.license_name && (
        <>
          {' · '}
          {a.license_url ? <a href={a.license_url} {...ext}>{a.license_name}</a> : a.license_name}
        </>
      )}
      {' · '}
      <Popover content={<Details a={a} />} trigger="click" placement="topRight">
        <a role="button" tabIndex={0} style={{ cursor: 'pointer' }}>details</a>
      </Popover>
    </div>
  )
}
