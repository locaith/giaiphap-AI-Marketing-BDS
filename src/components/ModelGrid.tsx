import { useState } from 'react'
import type { ModelProvider } from '../content'

/**
 * Lưới nhà cung cấp mô hình, dùng logo thật.
 *
 * Ảnh tải trễ và chỉ hiện lên khi đã tải xong, nhưng ô chứa luôn giữ đúng kích
 * thước từ đầu nên trang không nhảy dòng và không giật khi cuộn tới.
 */
export function ModelGrid({ items }: { items: ModelProvider[] }) {
  return (
    <div className="model-grid" data-stagger="scale" aria-label="Các mô hình có thể tích hợp">
      {items.map((item) => (
        <article className="model-item" key={item.name}>
          <div className="model-logo">
            {item.logo ? <LazyLogo item={item} /> : <Mark kind={item.mark} />}
          </div>
          <h3>{item.name}</h3>
          <p>{item.role}</p>
        </article>
      ))}
    </div>
  )
}

function LazyLogo({ item }: { item: ModelProvider }) {
  const [loaded, setLoaded] = useState(false)
  const height = 34
  const width = Math.round(height * (item.ratio ?? 1))

  return (
    <img
      className={loaded ? 'model-logo-img is-loaded' : 'model-logo-img'}
      src={item.logo}
      alt={`Logo ${item.name}`}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
    />
  )
}

/** Dấu hiệu tự vẽ cho nhà cung cấp không có logo dùng lại được. */
function Mark({ kind }: { kind?: 'private' }) {
  if (kind !== 'private') return null

  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="10.5" width="17" height="10" rx="2.5" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
      <circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
