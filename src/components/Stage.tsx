import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowDown } from './Icons'
import type { Beat } from '../content'
import { dwellFor, poseFor, prefersReducedMotion, useSectionProgress } from '../lib/useStage'

type StageProps = {
  beats: Beat[]
  eyebrow: string
  heading: string
  lead: string
  footnote: string
}

/**
 * Scroll-locked storytelling section.
 *
 * The section is `(beats + 1) × 100vh` tall with a sticky 100vh viewport, so
 * every beat owns exactly one screen of scrolling. Inside that screen the beat
 * is held completely still for the first 70% — the reader gets to finish the
 * line before anything moves — and only hands over to the next beat in the
 * final 30%. Invisible snap targets sit at each hand-over point so the scroll
 * settles on a beat rather than between two.
 */
export function Stage({ beats, eyebrow, heading, lead, footnote }: StageProps) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>()
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced) return
    document.documentElement.classList.add('snap-stage')
    return () => document.documentElement.classList.remove('snap-stage')
  }, [reduced])

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      setTilt({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  if (reduced) {
    return (
      <section className="stage-section" id="san-pham">
        <div className="container">
          <StageIntro eyebrow={eyebrow} heading={heading} lead={lead} showCue={false} />
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

  const raw = progress * beats.length

  return (
    <section className="stage-section" id="san-pham">
      <div className="container">
        <StageIntro eyebrow={eyebrow} heading={heading} lead={lead} showCue />
      </div>

      <div className="stage" ref={ref} style={{ height: `${(beats.length + 1) * 100}vh` }}>
        {beats.map((beat, index) => (
          <div className="stage-snap" key={`snap-${beat.id}`} style={{ top: `${index * 100}vh` }} aria-hidden="true" />
        ))}

        <div className="stage-sticky">
          <div className="stage-wash" aria-hidden="true" />

          <div className="stage-rail" aria-hidden="true">
            {beats.map((beat, index) => (
              <span key={`rail-${beat.id}`} style={{ '--fill': dwellFor(raw - index) } as CSSProperties} />
            ))}
          </div>

          <div className="container stage-grid">
            <div className="stage-copy">
              {beats.map((beat, index) => {
                const pose = poseFor(raw - index)
                return (
                  <div
                    className="stage-beat"
                    key={`copy-${beat.id}`}
                    aria-hidden={pose.opacity < 0.5}
                    style={{
                      opacity: pose.opacity,
                      visibility: pose.visible ? 'visible' : 'hidden',
                      transform: `translate3d(0, ${pose.translateY * 0.4}px, 0)`,
                    }}
                  >
                    <BeatCopy beat={beat} />
                  </div>
                )
              })}
            </div>

            <div className="stage-deck">
              {beats.map((beat, index) => {
                const pose = poseFor(raw - index)
                return (
                  <div
                    className="stage-card"
                    key={`card-${beat.id}`}
                    aria-hidden={pose.opacity < 0.5}
                    style={{
                      opacity: pose.opacity,
                      visibility: pose.visible ? 'visible' : 'hidden',
                      filter: pose.blur > 0.06 ? `blur(${pose.blur.toFixed(2)}px)` : undefined,
                      transform: [
                        `translate3d(0, ${pose.translateY.toFixed(2)}px, ${pose.translateZ.toFixed(2)}px)`,
                        `rotateX(${(pose.rotateX + tilt.y * -1.6).toFixed(2)}deg)`,
                        `rotateY(${(tilt.x * 2.4).toFixed(2)}deg)`,
                        `scale(${pose.scale.toFixed(3)})`,
                      ].join(' '),
                    }}
                  >
                    <Screenshot beat={beat} eager={index === 0} />
                  </div>
                )
              })}
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
  lead,
  showCue,
}: {
  eyebrow: string
  heading: string
  lead: string
  showCue: boolean
}) {
  return (
    <div className="stage-intro" data-reveal>
      <div className="eyebrow eyebrow-accent">{eyebrow}</div>
      <h2>{heading}</h2>
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
