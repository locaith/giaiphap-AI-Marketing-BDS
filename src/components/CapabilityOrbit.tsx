import { useState, type CSSProperties, type ReactNode } from 'react'

export type Capability = {
  icon: ReactNode
  index: string
  title: string
  /** Nhãn ngắn hiện trên nhánh; tên đầy đủ chỉ hiện ở lõi. */
  short: string
  text: string
  meta: string
}

/** Bắt đầu từ đỉnh rồi chạy theo chiều kim đồng hồ. */
const ANGLES = [-90, -30, 30, 90, 150, 210]

/** Bán kính theo phần trăm khung, tách trục để nhánh trái phải không tràn mép. */
const RX = 37
const RY = 35

const point = (angle: number) => {
  const rad = (angle * Math.PI) / 180
  return { x: 50 + RX * Math.cos(rad), y: 50 + RY * Math.sin(rad) }
}

/**
 * Sáu năng lực xoay quanh một lõi.
 *
 * Nhánh chỉ mang biểu tượng và nhãn ngắn, còn tên đầy đủ cùng mô tả hiện ở lõi
 * theo nhánh đang chọn — nhờ vậy vòng tròn không bị đặc chữ. Màn hẹp đổ xuống
 * thành một trục dọc vì sáu nhánh quanh vòng sẽ chật.
 */
export function CapabilityOrbit({ items }: { items: Capability[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]

  return (
    <div className="orbit-shell">
      <div className="orbit" data-reveal="scale">
        <svg className="orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="50" cy="50" rx={RX} ry={RY} className="orbit-ring" vectorEffect="non-scaling-stroke" />
          {items.map((item, index) => {
            const { x, y } = point(ANGLES[index])
            return (
              <line
                key={item.title}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                className={index === active ? 'orbit-line is-active' : 'orbit-line'}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>

        <div className="orbit-core" role="status" aria-live="polite">
          <span className="orbit-core-tag">Năng lực {current.index}</span>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <span className="orbit-core-meta">{current.meta}</span>
        </div>

        {items.map((item, index) => {
          const { x, y } = point(ANGLES[index])
          return (
            <button
              key={item.title}
              type="button"
              className={index === active ? 'orbit-node is-active' : 'orbit-node'}
              style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              <span className="orbit-node-icon">{item.icon}</span>
              <span className="orbit-node-text">
                <em>{item.index}</em>
                {item.short}
              </span>
            </button>
          )
        })}
      </div>

      {/* Màn hẹp: cùng nội dung, xếp dọc theo một trục cho dễ đọc. */}
      <ol className="orbit-list" data-stagger="right">
        {items.map((item) => (
          <li key={item.title}>
            <span className="orbit-list-icon">{item.icon}</span>
            <div>
              <span className="orbit-list-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="orbit-list-meta">{item.meta}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
