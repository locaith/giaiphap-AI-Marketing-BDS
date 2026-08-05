import React, { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/useStage'

/**
 * `type` — gõ từng ký tự như đánh máy, dùng cho câu dẫn.
 * `rise` — cả cụm từ nổi lên dần, dùng cho những chữ cần nhấn mạnh.
 */
export type Segment = {
  text: string
  mode?: 'type' | 'rise'
  className?: string
  /** Tô màu chuyển dần teal → đồng theo từng từ. */
  gradient?: boolean
}

type Step = { at: number }

const PAUSE_MS = 220
const GAP_MS = 240

const GRADIENT_STOPS = ['#0f5568', '#1a7d90', '#a3762f']

/**
 * Một gốc thời gian dùng chung cho mọi khối chữ, nếu không mỗi khối sẽ lặp theo
 * nhịp riêng và lệch pha nhau — nhìn rất rối.
 */
let clockOrigin: number | null = null

const hex = (value: string) => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
]

/**
 * Dải màu rời theo từng từ thay cho `background-clip: text` — bắt buộc phải làm
 * vậy vì chữ cắt nền không thể mờ dần từng từ (chữ trong suốt, không có gì để mờ).
 */
function wordColor(ratio: number) {
  const span = 1 / (GRADIENT_STOPS.length - 1)
  const slot = Math.min(GRADIENT_STOPS.length - 2, Math.floor(ratio / span))
  const t = (ratio - slot * span) / span
  const from = hex(GRADIENT_STOPS[slot])
  const to = hex(GRADIENT_STOPS[slot + 1])
  const mix = from.map((channel, index) => Math.round(channel + (to[index] - channel) * t))
  return `rgb(${mix.join(', ')})`
}

/**
 * Chữ chạy theo dòng thời gian, không gây nhảy layout: toàn bộ nội dung được
 * dựng sẵn đúng vị trí, từng ký tự / từng từ chỉ đổi độ hiện. Ngắt dòng vẫn
 * theo từ vì mỗi từ là một khối riêng.
 */
export function KineticText({
  segments,
  startDelay = 0,
  typeMs = 30,
  riseMs = 110,
  cycleMs = 0,
  as: Tag = 'span',
  className,
  onDone,
}: {
  /**
   * PHẢI là hằng số đặt ngoài component. Nếu tạo mảng mới ở mỗi lần render thì
   * dòng thời gian bị dựng lại liên tục và chữ sẽ nhấp nháy không ngừng.
   */
  segments: Segment[]
  startDelay?: number
  typeMs?: number
  riseMs?: number
  /**
   * Độ dài một vòng, tính cả quãng nghỉ để đọc. Mọi khối chữ dùng cùng một con
   * số thì cả đoạn mở đầu chạy lại đồng thời. 0 = chạy đúng một lần.
   */
  cycleMs?: number
  as?: 'h1' | 'p' | 'span' | 'div'
  className?: string
  onDone?: () => void
}) {
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const [progress, setProgress] = useState(reduced ? Number.MAX_SAFE_INTEGER : 0)
  const hostRef = useRef<HTMLElement>(null)
  const doneRef = useRef(false)

  // Dựng dòng thời gian: mỗi bước là một ký tự (chế độ gõ) hoặc một từ (nổi lên).
  const { pieces, steps, total } = useMemo(() => {
    const built: Array<{
      segment: number
      mode: 'type' | 'rise'
      className?: string
      gradient?: boolean
      words: Array<{ text: string; units: Array<{ char: string; step: number }>; step: number; color?: string }>
    }> = []
    const timeline: Step[] = []
    let clock = startDelay

    segments.forEach((segment, segmentIndex) => {
      const mode = segment.mode ?? 'type'
      const words = segment.text.split(' ')
      const builtWords = words.map((word, wordIndex) => {
        if (mode === 'rise') {
          const step = timeline.length
          timeline.push({ at: clock })
          clock += riseMs
          const color = segment.gradient
            ? wordColor(words.length > 1 ? wordIndex / (words.length - 1) : 0)
            : undefined
          return { text: word, units: [], step, color }
        }
        const units = Array.from(word).map((char) => {
          const step = timeline.length
          timeline.push({ at: clock })
          clock += /[.,;:—–]/.test(char) ? typeMs + PAUSE_MS : typeMs
          return { char, step }
        })
        clock += typeMs
        return { text: word, units, step: -1 }
      })
      clock += GAP_MS
      built.push({
        segment: segmentIndex,
        mode,
        className: segment.className,
        gradient: segment.gradient,
        words: builtWords,
      })
    })

    return { pieces: built, steps: timeline, total: timeline.length }
  }, [segments, startDelay, typeMs, riseMs])

  useEffect(() => {
    if (reduced || total === 0) return

    let frame = 0
    let timer = 0
    let onScreen = true

    const tick = (now: number) => {
      if (clockOrigin === null) clockOrigin = now
      const elapsed = cycleMs > 0 ? (now - clockOrigin) % cycleMs : now - clockOrigin

      let count = 0
      while (count < total && steps[count].at <= elapsed) count += 1
      setProgress(count)

      if (count < total) {
        frame = requestAnimationFrame(tick)
        return
      }

      if (!doneRef.current) {
        doneRef.current = true
        onDone?.()
      }

      // Đã chạy xong: ngủ tới đầu vòng sau thay vì quay rAF không công.
      if (cycleMs > 0 && onScreen) {
        timer = window.setTimeout(
          () => {
            frame = requestAnimationFrame(tick)
          },
          Math.max(50, cycleMs - elapsed + 20),
        )
      }
    }

    frame = requestAnimationFrame(tick)

    // Khuất khỏi màn hình thì dừng hẳn, không chạy nền vô ích.
    const host = hostRef.current
    const observer = host
      ? new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting
            if (onScreen) {
              frame = requestAnimationFrame(tick)
            } else {
              cancelAnimationFrame(frame)
              window.clearTimeout(timer)
            }
          },
          { threshold: 0 },
        )
      : null
    if (host && observer) observer.observe(host)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [reduced, steps, total, cycleMs, onDone])

  const typing = !reduced && progress < total

  return (
    <Tag
      className={className}
      ref={hostRef as React.Ref<never>}
      data-typing={typing ? 'true' : undefined}
    >
      {pieces.map((piece, pieceIndex) => (
        <span className={piece.className} key={pieceIndex}>
          {piece.words.map((word, wordIndex) => (
            <span className="kt-word" key={wordIndex}>
              {piece.mode === 'rise' ? (
                <span
                  className="kt-rise"
                  data-on={progress > word.step ? 'true' : undefined}
                  style={word.color ? { color: word.color } : undefined}
                >
                  {word.text}
                </span>
              ) : (
                word.units.map((unit, unitIndex) => (
                  <span
                    className="kt-char"
                    data-on={progress > unit.step ? 'true' : undefined}
                    data-cursor={progress === unit.step + 1 && typing ? 'true' : undefined}
                    key={unitIndex}
                  >
                    {unit.char}
                  </span>
                ))
              )}
              {wordIndex < piece.words.length - 1 ? ' ' : null}
            </span>
          ))}
          {pieceIndex < pieces.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/** Bọc nội dung tĩnh để dùng chung nhịp hiện dần với KineticText. */
export function RiseIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="kt-rise" data-on="true" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </span>
  )
}
