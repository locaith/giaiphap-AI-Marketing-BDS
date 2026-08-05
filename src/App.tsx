import { useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Database,
  Film,
  Gauge,
  Layers,
  Menu,
  MessageSquare,
  Sparkles,
  Target,
  X,
} from './components/Icons'
import { Backdrop } from './components/Backdrop'
import { Stage } from './components/Stage'
import { beats, models, pains, signals } from './content'
import { photoCredits } from './credits'
import { buildDemoMailto, siteConfig } from './config'
import { prefersReducedMotion, useRevealOnScroll, useScrolledPast } from './lib/useStage'

const capabilities = [
  {
    icon: <Gauge />,
    index: '01',
    title: 'Đo lường quảng cáo',
    text: 'Đo hiệu quả quảng cáo, chiến dịch, khách hàng và chi phí theo từng dự án, kênh hoặc đội kinh doanh.',
    meta: 'Quảng cáo → Khách hàng → Quyết định',
  },
  {
    icon: <Sparkles />,
    index: '02',
    title: 'Xưởng chiến dịch AI',
    text: 'Từ nghiên cứu, chiến lược đến nội dung, hình ảnh và lịch triển khai trên cùng một luồng làm việc.',
    meta: 'Nghiên cứu → Chiến lược → Nội dung',
  },
  {
    icon: <Film />,
    index: '03',
    title: 'Sản xuất video bằng AI',
    text: 'Tạo video từ chữ hoặc ảnh, kèm lồng tiếng, phụ đề và nhiều tỷ lệ khung hình cho mạng xã hội.',
    meta: 'Chữ hoặc ảnh → Video',
  },
  {
    icon: <Database />,
    index: '04',
    title: 'Phân tích thời gian thực',
    text: 'Gom dữ liệu đang phân mảnh thành bảng điều khiển và báo cáo quản trị cập nhật liên tục.',
    meta: 'Một nguồn số liệu duy nhất',
  },
  {
    icon: <MessageSquare />,
    index: '05',
    title: 'Hỏi đáp dữ liệu',
    text: 'Hỏi dữ liệu bằng tiếng Việt qua Claude, GPT, Gemini, Kimi hoặc ứng dụng nội bộ của doanh nghiệp.',
    meta: 'Hỏi → Phân tích → Hành động',
  },
  {
    icon: <Layers />,
    index: '06',
    title: 'Thương hiệu và mạng xã hội',
    text: 'Quản trị bộ nhận diện, mạng xã hội và kho tài sản nội dung để giữ thông điệp nhất quán.',
    meta: 'Nhất quán ở mọi quy mô',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const stuck = useScrolledPast(20)
  const mailto = buildDemoMailto()

  useRevealOnScroll()

  return (
    <>
      <Backdrop variant="page" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} mailto={mailto} stuck={stuck} />

      <main>
        <Hero mailto={mailto} />

        <div className="ticker">
          <div className="container ticker-row">
            {signals.map((item) => (
              <div className="ticker-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <section className="section-pad" id="bai-toan">
          <div className="container split-grid">
            <div data-reveal>
              <div className="eyebrow">Khoảng trống vận hành</div>
              <h2>
                Không thiếu công cụ. <span className="italic-accent">Thiếu một mạch dữ liệu liền.</span>
              </h2>
              <p className="lead">
                Thêm phần mềm không vá được dữ liệu phân mảnh. Locaith dựng một lớp vận hành chung giữa quảng cáo, nội
                dung, khách hàng và quản trị — để mọi con số nói cùng một ngôn ngữ.
              </p>
            </div>
            <div className="pain-list" data-reveal data-delay="1">
              {pains.map((pain, index) => (
                <div className="pain-row" key={pain}>
                  <span className="pain-index">0{index + 1}</span>
                  <p>{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Stage
          beats={beats}
          eyebrow="Cuộn để xem"
          heading="Năm màn hình. Một mạch số liệu."
          lead="Mỗi lần cuộn là một câu. Đọc trọn câu rồi hãy cuộn tiếp — thứ tự đã được sắp sẵn theo đúng cách dữ liệu chảy trong doanh nghiệp."
          footnote="Ảnh chụp từ một triển khai thật. Các con số hiển thị là dữ liệu minh hoạ."
        />

        <section className="section-pad" id="nen-tang">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <div className="eyebrow">Một lớp trí tuệ chung</div>
                <h2>
                  Một nền tảng. <span className="italic-accent">Sáu năng lực cốt lõi.</span>
                </h2>
              </div>
              <p className="lead">
                Bắt đầu từ một điểm đau, sau đó mở rộng theo đúng dữ liệu và quy trình thật của doanh nghiệp.
              </p>
            </div>

            <div className="capability-grid">
              {capabilities.map((item) => (
                <article className="capability-card" data-reveal key={item.title}>
                  <div className="card-topline">
                    <div className="icon-shell">{item.icon}</div>
                    <span>{item.index}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="card-meta">{item.meta}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad workflow-section" id="cach-hoat-dong">
          <div className="container workflow-grid">
            <div className="workflow-copy" data-reveal>
              <div className="eyebrow">Từ tín hiệu đến hành động</div>
              <h2>
                Không chỉ nhìn dữ liệu. <span className="italic-accent">Hệ thống giúp đội ngũ hành động.</span>
              </h2>
              <p className="lead">
                Locaith nối ba vòng lặp vốn đang tách rời: hiểu điều gì đang xảy ra, tạo phương án tiếp theo và đo lại
                kết quả sau khi triển khai.
              </p>
              <a className="text-link" href={mailto}>
                Đăng ký demo <ArrowRight />
              </a>
            </div>
            <div className="workflow-rail" data-reveal data-delay="1">
              <WorkflowStep
                number="01"
                title="Kết nối"
                text="Kết nối quảng cáo, dữ liệu khách hàng, chiến dịch, file và các nguồn dữ liệu nội bộ."
              />
              <WorkflowStep
                number="02"
                title="Thấu hiểu"
                text="AI chuẩn hoá dữ liệu, tạo nhận định, báo cáo và câu trả lời theo đúng ngữ cảnh."
              />
              <WorkflowStep
                number="03"
                title="Hành động"
                text="Tạo chiến dịch, nội dung, video và bước tối ưu tiếp theo ngay trên nền tảng."
              />
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container model-card" data-reveal>
            <div>
              <div className="eyebrow">Đa mô hình ngay từ thiết kế</div>
              <h2>
                Dùng đúng mô hình <span className="italic-accent">cho đúng công việc.</span>
              </h2>
              <p className="lead">
                Claude cho phân tích sâu, GPT cho tác vụ tổng quát, Gemini cho hệ sinh thái Google, Kimi cho ngữ cảnh
                dài và Seedance cho video. Kiến trúc không khoá doanh nghiệp vào một nhà cung cấp duy nhất.
              </p>
            </div>
            <div className="model-cloud" aria-label="Các mô hình có thể tích hợp">
              {models.map((model) => (
                <div className="model-pill" key={model}>
                  {model}
                </div>
              ))}
              <div className="model-core">
                <span>LOCAITH</span>
                <strong>ĐIỀU PHỐI MÔ HÌNH</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad" id="thuc-te">
          <div className="container case-grid">
            <div className="case-panel" data-reveal>
              <div className="eyebrow">Bài toán bất động sản thực tế</div>
              <h2>
                Sinh ra từ bài toán vận hành thật
                {siteConfig.caseStudyPublic ? (
                  <>
                    {' '}
                    cùng <span className="italic-accent">{siteConfig.caseStudyName}</span>.
                  </>
                ) : (
                  '.'
                )}
              </h2>
              <p className="lead">
                Từ nhu cầu đo hiệu quả quảng cáo, hệ thống được mở rộng thành lớp AI cho chiến dịch, báo cáo, phân tích
                dữ liệu, hỏi đáp và sản xuất nội dung đa định dạng.
              </p>
              <div className="case-checks">
                {[
                  'Tối ưu chiến dịch tự động',
                  'Phân tích dữ liệu thời gian thực',
                  'Bảng điều khiển quản trị vận hành bằng AI',
                  'Trợ lý dữ liệu trò chuyện bằng tiếng Việt',
                ].map((item) => (
                  <div key={item}>
                    <Check />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="insight-card" data-reveal data-delay="1">
              <div className="insight-header">
                <span>Bản tin điều hành</span>
                <span className="status-dot">Trực tiếp</span>
              </div>
              <p className="insight-question">“Chiến dịch nào đang tạo khách hàng chất lượng với chi phí tốt nhất?”</p>
              <div className="insight-answer">
                <div className="avatar-mark">L</div>
                <div>
                  <strong>Trợ lý dữ liệu Locaith</strong>
                  <p>
                    Nhóm dự án phía Nam đang có chi phí mỗi khách hàng thấp nhất, trong khi hai chiến dịch vẫn tiêu ngân
                    sách mà chưa ra khách hàng nào. Khuyến nghị dịch ngân sách sang nhóm hiệu quả và tạm dừng nhóm còn
                    lại.
                  </p>
                </div>
              </div>
              <div className="insight-bars" aria-hidden="true">
                <span style={{ '--bar': '86%' } as CSSProperties} />
                <span style={{ '--bar': '63%' } as CSSProperties} />
                <span style={{ '--bar': '41%' } as CSSProperties} />
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad cta-section" id="demo">
          <div className="container cta-card" data-reveal>
            <div>
              <div className="eyebrow">Sẵn sàng nhìn dữ liệu theo cách khác?</div>
              <h2>Đưa một chiến dịch thật. Locaith dựng luồng demo thật.</h2>
              <p>
                20 phút để nhìn thấy cách Locaith nối dữ liệu, nhận định và hành động cho chính doanh nghiệp bất động
                sản của bạn.
              </p>
            </div>
            <div className="cta-actions">
              <a className="button button-primary" href={mailto}>
                Đăng ký demo <ArrowRight />
              </a>
              <a className="button button-ghost" href={siteConfig.homeUrl} target="_blank" rel="noreferrer">
                Xem Locaith.com <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-row">
          <div className="wordmark">
            <img className="wordmark-logo" src="/logo-locaith.png" alt="Logo Locaith" width="28" height="28" />
            <span>LOCAITH</span>
            <small>AI BĐS</small>
          </div>
          <p>Nền tảng đo lường và tự động hoá Marketing Bất động sản</p>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        </div>
        <div className="container">
          <details className="photo-credits">
            <summary>Ảnh nền: dự án bất động sản Việt Nam · nguồn Wikimedia Commons</summary>
            <ul>
              {photoCredits.map((credit) => (
                <li key={credit.file}>
                  <strong>{credit.project}</strong> — {credit.author || 'không rõ tác giả'} ·{' '}
                  <a href={credit.source} target="_blank" rel="noreferrer noopener">
                    {credit.license}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </footer>
    </>
  )
}

function Header({
  menuOpen,
  setMenuOpen,
  mailto,
  stuck,
}: {
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
  mailto: string
  stuck: boolean
}) {
  const close = () => setMenuOpen(false)
  return (
    <header className="topbar" data-stuck={stuck}>
      <div className="container nav-row">
        <a className="wordmark" href="#dau-trang" aria-label="Locaith — về đầu trang">
          <img className="wordmark-logo" src="/logo-locaith.png" alt="" width="28" height="28" />
          <span>LOCAITH</span>
          <small>AI BĐS</small>
        </a>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Điều hướng chính">
          <a href="#bai-toan" onClick={close}>
            Bài toán
          </a>
          <a href="#san-pham" onClick={close}>
            Sản phẩm
          </a>
          <a href="#nen-tang" onClick={close}>
            Nền tảng
          </a>
          <a href="#thuc-te" onClick={close}>
            Thực tế
          </a>
          <a className="nav-cta" href={mailto} onClick={close}>
            Đăng ký demo <ArrowUpRight />
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}

function Hero({ mailto }: { mailto: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      setTilt({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const hero = beats[0]

  return (
    <section className="hero" id="dau-trang">
      <Backdrop variant="hero" />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="container hero-inner cinema">
        <div className="eyebrow eyebrow-accent">{siteConfig.productTagline}</div>
        <h1 className="hero-title">
          <span>Mỗi đồng ngân sách</span>
          <span className="italic-accent">đều biết nó đã đi về đâu.</span>
        </h1>
        <p className="lead hero-lead">
          Locaith nối quảng cáo với dữ liệu khách hàng, chiến dịch và báo cáo — để chủ đầu tư và sàn phân phối nhìn thấy
          hiệu quả thật và ra quyết định ngay trên số liệu.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#san-pham">
            Xem sản phẩm <ArrowRight />
          </a>
          <a className="button button-ghost" href={mailto}>
            Đăng ký demo <ArrowUpRight />
          </a>
        </div>
        <div className="hero-note">
          <span className="live-dot" aria-hidden="true" />
          Đa mô hình · Không phụ thuộc nhà cung cấp · Đang chạy trên triển khai thật
        </div>
      </div>

      <div className="container hero-stage">
        <div className="hero-chip hero-chip-a">
          <Target /> Khách hàng gắn đúng <b>chiến dịch</b>
        </div>
        <div className="hero-chip hero-chip-b">
          Chi phí mỗi khách hàng · <b>cập nhật liên tục</b>
        </div>
        <div className="hero-device" style={{ '--tx': tilt.x, '--ty': tilt.y } as CSSProperties}>
          <figure className="frame">
            <div className="frame-bar">
              <div className="frame-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="frame-url">{siteConfig.landingUrl.replace('https://', '')} · bảng điều khiển</div>
            </div>
            <img
              className="frame-shot"
              src={hero.image}
              srcSet={`${hero.imageSmall} 720w, ${hero.image} ${hero.width}w`}
              sizes="(max-width: 900px) 92vw, 1120px"
              width={hero.width}
              height={hero.height}
              alt={hero.alt}
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

function WorkflowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="workflow-step">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default App
