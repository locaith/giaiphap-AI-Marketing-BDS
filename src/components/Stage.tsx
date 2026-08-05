import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { ArrowDown } from './Icons'
import type { Beat } from '../content'
import { dwellFor, poseFor, prefersReducedMotion, useSectionProgress } from '../lib/useStage'

type StageProps = {
  beats: Beat[]
  eyebrow: string
  heading: string
  /** Vế được nhấn ở cuối tiêu đề, in nghiêng và tô dải màu như các phần khác. */
  headingAccent: string
  lead: string
  footnote: string
}

/**
 * Phần cuộn khoá kể chuyện.
 *
 * Khối cao `(số nhịp + 1)` màn hình với một khung dính cao đúng một màn, nên mỗi
 * nhịp chiếm trọn một lần cuộn. Trong lần cuộn đó, nhịp đứng yên suốt 70% đầu để
 * người đọc kịp đọc hết câu, 30% cuối mới bàn giao cho nhịp kế. Các điểm neo vô
 * hình đặt đúng chỗ bàn giao nên cuộn dừng ở một nhịp trọn vẹn.
 *
 * Mọi thay đổi theo cuộn được ghi thẳng vào DOM chứ không qua state của React —
 * dựng lại cây phần tử mỗi khung hình sẽ giật trên điện thoại.
 */
export function Stage({ beats, eyebrow, heading, headingAccent, lead, footnote }: StageProps) {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const cards = useRef<Array<HTMLDivElement | null>>([])
  const copies = useRef<Array<HTMLDivElement | null>>([])
  const rails = useRef<Array<HTMLSpanElement | null>>([])
  const tilt = useRef({ x: 0, y: 0 })
  const progress = useRef(0)

  const paint = useCallback(() => {
    const raw = progress.current * beats.length
    const { x, y } = tilt.current

    for (let index = 0; index < beats.length; index += 1) {
      // Nhịp cuối không rời đi, nếu không quãng cuộn cuối sẽ trống trơn.
      const distance = index === beats.length - 1 ? Math.min(raw - index, 0.7) : raw - index
      const pose = poseFor(distance)

      const card = cards.current[index]
      if (card) {
        card.style.opacity = String(pose.opacity)
        card.style.visibility = pose.visible ? 'visible' : 'hidden'
        card.style.filter = pose.blur > 0.06 ? `blur(${pose.blur.toFixed(2)}px)` : ''
        card.style.transform =
          `translate3d(0, ${pose.translateY.toFixed(2)}px, ${pose.translateZ.toFixed(2)}px) ` +
          `rotateX(${(pose.rotateX + y * -1.6).toFixed(2)}deg) ` +
          `rotateY(${(x * 2.4).toFixed(2)}deg) ` +
          `scale(${pose.scale.toFixed(3)})`
        card.setAttribute('aria-hidden', pose.opacity < 0.5 ? 'true' : 'false')
      }

      const copy = copies.current[index]
      if (copy) {
        copy.style.opacity = String(pose.opacity)
        copy.style.visibility = pose.visible ? 'visible' : 'hidden'
        copy.style.transform = `translate3d(0, ${(pose.translateY * 0.4).toFixed(2)}px, 0)`
        copy.setAttribute('aria-hidden', pose.opacity < 0.5 ? 'true' : 'false')
      }

      const rail = rails.current[index]
      if (rail) rail.style.setProperty('--fill', dwellFor(distance).toFixed(3))
    }
  }, [beats.length])

  const ref = useSectionProgress<HTMLDivElement>(
    useCallback(
      (value: number) => {
        progress.current = value
        paint()
      },
      [paint],
    ),
  )

  useEffect(() => {
    if (reduced) return
    document.documentElement.classList.add('snap-stage')
    return () => document.documentElement.classList.remove('snap-stage')
  }, [reduced])

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      tilt.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        paint()
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced, paint])

  useEffect(() => {
    if (!reduced) paint()
  }, [reduced, paint])

  if (reduced) {
    return (
      <section className="stage-section" id="san-pham">
        <div className="container">
          <StageIntro
            eyebrow={eyebrow}
            heading={heading}
            headingAccent={headingAccent}
            lead={lead}
            showCue={false}
          />
          <div className="stage-static">
            {beats.map((beat) => (
              <article className="stage-static-item" key={beat.id}>
                <div className="stage-beat">
                  <BeatCopy beat={beat} />
                </div>
                <div className="stage-deck-static">
                  <Screenshot beat={beat} eager={false} />
                </div>
              </article>
            ))}
          </div>
          <p className="stage-footnote stage-footnote-static">{footnote}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="stage-section" id="san-pham">
      <div className="container">
        <StageIntro eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} lead={lead} showCue />
      </div>

      <div className="stage" ref={ref} style={{ '--stage-screens': beats.length + 1 } as CSSProperties}>
        {beats.map((beat, index) => (
          <div
            className="stage-snap"
            key={`snap-${beat.id}`}
            style={{ '--snap-index': index } as CSSProperties}
            aria-hidden="true"
          />
        ))}

        <div className="stage-sticky">
          <div className="stage-wash" aria-hidden="true" />

          <div className="stage-rail" aria-hidden="true">
            {beats.map((beat, index) => (
              <span
                key={`rail-${beat.id}`}
                ref={(node) => {
                  rails.current[index] = node
                }}
              />
            ))}
          </div>

          <div className="container stage-grid">
            <div className="stage-copy">
              {beats.map((beat, index) => (
                <div
                  className="stage-beat"
                  key={`copy-${beat.id}`}
                  ref={(node) => {
                    copies.current[index] = node
                  }}
                >
                  <BeatCopy beat={beat} />
                </div>
              ))}
            </div>

            <div className="stage-deck">
              {beats.map((beat, index) => (
                <div
                  className="stage-card"
                  key={`card-${beat.id}`}
                  ref={(node) => {
                    cards.current[index] = node
                  }}
                >
                  <Screenshot beat={beat} eager={index === 0} />
                </div>
              ))}
            </div>
          </div>

          <p className="stage-footnote">{footnote}</p>
        </div>
      </div>
    </section>
  )
}

function StageIntro({
  eyebrow,
  heading,
  headingAccent,
  lead,
  showCue,
}: {
  eyebrow: string
  heading: string
  headingAccent: string
  lead: string
  showCue: boolean
}) {
  return (
    <div className="stage-intro" data-reveal>
      <div className="eyebrow eyebrow-accent">{eyebrow}</div>
      <h2>
        {heading} <span className="italic-accent">{headingAccent}</span>
      </h2>
      <p className="lead">{lead}</p>
      {showCue ? (
        <div className="scroll-cue">
          Cuộn xuống
          <ArrowDown />
        </div>
      ) : null}
    </div>
  )
}

function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <>
      <div className="stage-beat-tag">
        <i>{beat.index}</i>
        {beat.tag}
      </div>
      <h2>{beat.title}</h2>
      <p>{beat.text}</p>
    </>
  )
}

function Screenshot({ beat, eager }: { beat: Beat; eager: boolean }) {
  return (
    <figure className="frame">
      <div className="frame-bar">
        <div className="frame-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="frame-url">{beat.path}</div>
      </div>
      <img
        className="frame-shot"
        src={beat.image}
        srcSet={`${beat.imageSmall} 720w, ${beat.image} ${beat.width}w`}
        sizes="(max-width: 1060px) 92vw, 62vw"
        width={beat.width}
        height={beat.height}
        alt={beat.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  )
}
