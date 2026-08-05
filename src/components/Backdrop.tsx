import { photoCredits } from '../credits'

const COLUMNS = 7
const PER_COLUMN = 5

const tiles = photoCredits.map((credit) => `/projects/${credit.file}`)

/** Mỗi cột lấy một lát khác nhau của bộ ảnh nên không cột nào trùng cột nào. */
const columns = Array.from({ length: COLUMNS }, (_, column) =>
  Array.from({ length: PER_COLUMN }, (_, row) => tiles[(column * 3 + row * 2) % tiles.length]),
)

const DURATIONS = [104, 82, 118, 90, 72, 110, 86]

/**
 * Nền lưới dự án bất động sản Việt Nam, đặt chéo và trôi dọc rất chậm.
 *
 * Dùng CSS transform thay cho GIF: nhẹ hơn nhiều lần, không vỡ màu, co giãn
 * theo mọi kích thước màn hình và tự dừng khi người dùng bật "giảm chuyển động".
 */
export function Backdrop({ variant }: { variant: 'page' | 'hero' }) {
  return (
    <div className={`backdrop backdrop-${variant}`} aria-hidden="true">
      <div className="backdrop-plane">
        {columns.map((column, index) => (
          <div className="backdrop-col" key={index} style={{ ['--dur' as string]: `${DURATIONS[index]}s` }}>
            <div className="backdrop-track">
              {[...column, ...column].map((src, position) => (
                <img
                  key={`${src}-${position}`}
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={520}
                  height={650}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
