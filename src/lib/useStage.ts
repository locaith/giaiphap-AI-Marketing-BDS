import { useEffect, useRef, useState } from 'react'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Progress 0 → 1 of how far a tall section has been scrolled through.
 * Only recalculates while the section is on screen, and skips React updates
 * when the rounded value has not moved.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let frame = 0
    let active = true
    let last = -1

    const measure = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const next = scrollable <= 0 ? 0 : clamp(-rect.top / scrollable)
      const rounded = Math.round(next * 2000) / 2000
      if (rounded === last) return
      last = rounded
      setProgress(rounded)
    }

    const request = () => {
      if (!active || frame) return
      frame = requestAnimationFrame(measure)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) request()
      },
      { rootMargin: '10% 0px' },
    )

    observer.observe(element)
    measure()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return { ref, progress }
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolledPast(offset = 24) {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setPassed(window.scrollY > offset)
    }
    const request = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', request, { passive: true })
    return () => {
      window.removeEventListener('scroll', request)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset])

  return passed
}

/** Reveal-on-enter for every `[data-reveal]` node currently in the document. */
export function useRevealOnScroll() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (prefersReducedMotion()) {
      nodes.forEach((node) => {
        node.dataset.visible = 'true'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const node = entry.target as HTMLElement
          node.dataset.visible = 'true'
          observer.unobserve(node)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

export type CardPose = {
  opacity: number
  translateY: number
  translateZ: number
  rotateX: number
  scale: number
  blur: number
  visible: boolean
}

const OFF_BELOW: CardPose = {
  opacity: 0,
  translateY: 90,
  translateZ: -520,
  rotateX: 11,
  scale: 0.88,
  blur: 10,
  visible: false,
}

const ON_STAGE: CardPose = {
  opacity: 1,
  translateY: 0,
  translateZ: 0,
  rotateX: 0,
  scale: 1,
  blur: 0,
  visible: true,
}

const OFF_ABOVE: CardPose = {
  opacity: 0,
  translateY: -70,
  translateZ: 300,
  rotateX: -9,
  scale: 1.08,
  blur: 8,
  visible: false,
}

const blend = (from: CardPose, to: CardPose, t: number): CardPose => ({
  opacity: lerp(from.opacity, to.opacity, t),
  translateY: lerp(from.translateY, to.translateY, t),
  translateZ: lerp(from.translateZ, to.translateZ, t),
  rotateX: lerp(from.rotateX, to.rotateX, t),
  scale: lerp(from.scale, to.scale, t),
  blur: lerp(from.blur, to.blur, t),
  visible: true,
})

/** Window (in beat-units) during which one beat hands over to the next. */
const HANDOVER = 0.3

/**
 * `distance` is `progress * beats - index`:
 *  < -HANDOVER  → waiting below the stage
 *  -HANDOVER→0  → moving in
 *  0 → 1-HANDOVER → held still so the line can actually be read
 *  1-HANDOVER→1 → moving out
 */
export function poseFor(distance: number): CardPose {
  if (distance <= -HANDOVER) return OFF_BELOW
  if (distance < 0) return blend(OFF_BELOW, ON_STAGE, easeInOut((distance + HANDOVER) / HANDOVER))
  if (distance < 1 - HANDOVER) return ON_STAGE
  if (distance < 1) return blend(ON_STAGE, OFF_ABOVE, easeInOut((distance - (1 - HANDOVER)) / HANDOVER))
  return OFF_ABOVE
}

/** How "settled" a beat is, 0 while moving and 1 while held. Drives the rail. */
export function dwellFor(distance: number): number {
  if (distance <= -HANDOVER || distance >= 1) return 0
  if (distance < 0) return clamp((distance + HANDOVER) / HANDOVER)
  if (distance < 1 - HANDOVER) return 1
  return clamp(1 - (distance - (1 - HANDOVER)) / HANDOVER)
}
