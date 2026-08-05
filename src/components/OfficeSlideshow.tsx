import { useEffect, useMemo, useState } from 'react'
import { prefersReducedMotion } from '../lib/useStage'

type Slide = {
  src: string
  alt: string
  caption: string
}

const SLIDES: Slide[] = [
  {
    src: '/nic/nic-bien.webp',
    alt: 'Biển Trung tâm Đổi mới Sáng tạo Quốc gia NIC',
    caption: 'Trung tâm Đổi mới Sáng tạo Quốc gia · 7 Tôn Thất Thuyết, Hà Nội',
  },
  {
    src: '/nic/nic-phong-hop.webp',
    alt: 'Phòng họp tại Trung tâm Đổi mới Sáng tạo Quốc gia',
    caption: 'Phòng họp nơi Locaith trình bày giải pháp trực tiếp',
  },
]

const INTERVAL = 5200

/** Hai ảnh nơi làm việc, tự đổi qua lại; đứng yên khi người dùng bật "giảm chuyển động". */
export function OfficeSlideshow() {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length)
    }, INTERVAL)
    return () => window.clearInterval(timer)
  }, [reduced])

  return (
    <figure className="office-show" data-reveal="right" data-delay="1">
      <div className="office-frame">
        {SLIDES.map((slide, position) => (
          <img
            key={slide.src}
            className={position === index ? 'office-slide is-on' : 'office-slide'}
            src={slide.src}
            alt={slide.alt}
            width={1000}
            height={667}
            loading={position === 0 ? 'eager' : 'lazy'}
            decoding="async"
            aria-hidden={position === index ? undefined : true}
          />
        ))}

        {reduced ? null : (
          <div className="office-dots" role="tablist" aria-label="Chọn ảnh">
            {SLIDES.map((slide, position) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={position === index}
                aria-label={slide.alt}
                className={position === index ? 'is-on' : undefined}
                onClick={() => setIndex(position)}
              />
            ))}
          </div>
        )}
      </div>
      <figcaption>{SLIDES[index].caption}</figcaption>
    </figure>
  )
}
