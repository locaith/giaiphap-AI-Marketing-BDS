import { useEffect, useRef, useState } from 'react'
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
import { CapabilityOrbit, type Capability } from './components/CapabilityOrbit'
import { FloatingWidgets } from './components/FloatingWidgets'
import { OfficeSlideshow } from './components/OfficeSlideshow'
import { KineticText, type Segment } from './components/KineticText'
import { ModelGrid } from './components/ModelGrid'
import { Stage } from './components/Stage'
import { beats, dataChain, models, signals } from './content'
import { photoCredits } from './credits'
import { siteConfig } from './config'
import { prefersReducedMotion, useRevealOnScroll, useScrolledPast } from './lib/useStage'

const capabilities: Capability[] = [
  {
    icon: <Gauge />,
    index: '01',
    title: 'Quản Trị Hiệu Quả Quảng Cáo & ROI',
    short: 'Quảng cáo & ROI',
    text: 'Đo hiệu quả quảng cáo, chiến dịch, khách hàng và chi phí theo từng dự án, kênh hoặc đội kinh doanh.',
    meta: 'Quảng cáo → Khách hàng → Quyết định',
  },
  {
    icon: <Sparkles />,
    index: '02',
    title: 'Trung Tâm Đóng Gói Chiến Dịch AI',
    short: 'Chiến dịch AI',
    text: 'Từ nghiên cứu, chiến lược đến nội dung, hình ảnh và lịch triển khai trên cùng một luồng làm việc.',
    meta: 'Nghiên cứu → Chiến lược → Nội dung',
  },
  {
    icon: <Film />,
    index: '03',
    title: 'Nhà Máy Sản Xuất Video BĐS Hàng Loạt',
    short: 'Video hàng loạt',
    text: 'Tạo video từ chữ hoặc ảnh, kèm lồng tiếng, phụ đề và nhiều tỷ lệ khung hình cho mạng xã hội.',
    meta: 'Chữ hoặc ảnh → Video',
  },
  {
    icon: <Database />,
    index: '04',
    title: 'Phân tích thời gian thực',
    short: 'Thời gian thực',
    text: 'Gom dữ liệu đang phân mảnh thành bảng điều khiển và báo cáo quản trị cập nhật liên tục.',
    meta: 'Một nguồn số liệu duy nhất',
  },
  {
    icon: <MessageSquare />,
    index: '05',
    title: 'Hỏi đáp dữ liệu',
    short: 'Hỏi đáp dữ liệu',
    text: 'Hỏi dữ liệu bằng tiếng Việt qua Claude, GPT, Gemini hoặc ứng dụng nội bộ của doanh nghiệp.',
    meta: 'Hỏi → Phân tích → Hành động',
  },
  {
    icon: <Layers />,
    index: '06',
    title: 'Quản Trị Thương Hiệu & Kho Tài Nguyên Số',
    short: 'Thương hiệu',
    text: 'Quản trị bộ nhận diện, mạng xã hội và kho tài sản nội dung để giữ thông điệp nhất quán.',
    meta: 'Nhất quán ở mọi quy mô',
  },
]

/**
 * Đặt ngoài component: nếu dựng mảng mới ở mỗi lần render thì dòng thời gian bị
 * tính lại liên tục và chữ sẽ nhấp nháy không ngừng.
 */
const HERO_EYEBROW: Segment[] = [{ text: siteConfig.productTagline }]
const HERO_LINE_1: Segment[] = [{ text: 'Biết chính xác khoản chi nào' }]
const HERO_LINE_2: Segment[] = [{ text: 'tạo doanh thu.', mode: 'rise', gradient: true }]
const HERO_LEAD: Segment[] = [
  { text: 'Locaith gom và nối dữ liệu quảng cáo, khách hàng, bán hàng và nội dung vào một hệ thống' },
  { text: 'được thiết kế riêng cho từng doanh nghiệp,', mode: 'rise', className: 'lead-em' },
  { text: 'giúp theo dõi hiệu quả, làm báo cáo nhanh và' },
  { text: 'ra quyết định bằng AI.', mode: 'rise', className: 'lead-em' },
]

/** Một vòng chữ mở đầu: chạy hết khoảng 6 giây rồi đứng yên gần 7 giây cho người đọc. */
const HERO_CYCLE = 13000

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const stuck = useScrolledPast(20)
  const contactUrl = siteConfig.zaloUrl

  useRevealOnScroll()

  return (
    <>
      <Backdrop />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} contactUrl={contactUrl} stuck={stuck} />

      <main>
        <Hero contactUrl={contactUrl} />

        <div className="ticker">
          <div className="container ticker-row" data-stagger="scale">
            {signals.map((item) => (
              <div className="ticker-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <section className="section-pad" id="bai-toan">
          <div className="container split-grid">
            <div data-reveal="left">
              <div className="eyebrow">Chuẩn hoá dữ liệu xuyên suốt</div>
              <h2>
                Không thiếu công cụ. <span className="italic-accent">Thiếu một chuẩn dữ liệu chung.</span>
              </h2>
              <p className="lead">
                Mỗi bộ phận đang đo một kiểu nên cùng một câu hỏi lại ra ba con số khác nhau. Locaith chuẩn hoá dữ liệu
                suốt chặng từ lúc quảng cáo chạy đến lúc hợp đồng ký — một bộ định nghĩa, một cách tính, dùng chung cho
                marketing, kinh doanh và ban lãnh đạo.
              </p>
            </div>
            <div className="pain-list" data-stagger="right">
              {dataChain.map((step, index) => (
                <div className="pain-row" key={step.title}>
                  <span className="pain-index">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Stage
          beats={beats}
          eyebrow="Cuộn để xem"
          heading="Giao diện phân tích trực quan,"
          headingAccent="từ dữ liệu thô đến khuyến nghị."
          lead="Năm màn hình đang chạy thật: khách hàng từ quảng cáo, hiệu quả từng chiến dịch, báo cáo theo kỳ, hỏi đáp bằng tiếng Việt và khuyến nghị ngân sách. Mỗi lần cuộn là một màn — đọc trọn rồi hãy cuộn tiếp."
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

            <CapabilityOrbit items={capabilities} />
          </div>
        </section>

        <section className="section-pad workflow-section" id="cach-hoat-dong">
          <div className="container workflow-grid">
            <div className="workflow-copy" data-reveal="left">
              <div className="eyebrow">Từ tín hiệu đến hành động</div>
              <h2>
                Không chỉ nhìn dữ liệu. <span className="italic-accent">Hệ thống giúp đội ngũ hành động.</span>
              </h2>
              <p className="lead">
                Locaith nối ba vòng lặp vốn đang tách rời: hiểu điều gì đang xảy ra, tạo phương án tiếp theo và đo lại
                kết quả sau khi triển khai.
              </p>
              <a className="text-link" href={contactUrl} target="_blank" rel="noreferrer noopener">
                Liên hệ ngay <ArrowRight />
              </a>
            </div>
            <div className="workflow-rail" data-stagger="right">
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
          <div className="container model-card" data-reveal="scale">
            <div>
              <div className="eyebrow">Đa mô hình ngay từ thiết kế</div>
              <h2>
                Dùng đúng mô hình <span className="italic-accent">cho đúng công việc.</span>
              </h2>
              <p className="lead">
                Claude cho phân tích sâu, GPT cho tác vụ tổng quát, Gemini cho hệ sinh thái Google và Seedance cho
                video. Kiến trúc không khoá doanh nghiệp vào một nhà cung cấp duy nhất.
              </p>
            </div>
            <div className="model-cloud">
              <ModelGrid items={models} />
              <div className="model-core">
                <span>LOCAITH</span>
                <strong>ĐIỀU PHỐI MÔ HÌNH</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad" id="dat-lich">
          <div className="container case-grid">
            <div className="case-panel" data-reveal="left">
              <div className="eyebrow">Hẹn gặp xem demo</div>
              <h2>
                Gặp trực tiếp một buổi,{' '}
                <span className="italic-accent">xem hệ thống chạy thật.</span>
              </h2>
              <p className="lead">
                Locaith mời anh chị tới văn phòng tại Trung tâm Đổi mới Sáng tạo Quốc gia — số 7 Tôn Thất Thuyết, Hà
                Nội — hoặc gặp trực tuyến nếu ở xa. Một buổi khoảng 45 phút là đủ để thấy giải pháp vận hành ra sao.
              </p>
              <div className="case-checks" data-stagger="left">
                {[
                  'Xem hệ thống chạy trực tiếp, không phải bản trình chiếu',
                  'Dựng thử trên chính dữ liệu quảng cáo của doanh nghiệp',
                  'Ước lượng phạm vi, thời gian và chi phí triển khai',
                  'Trao đổi thẳng với đội trực tiếp làm sản phẩm',
                ].map((item) => (
                  <div key={item}>
                    <Check />
                    {item}
                  </div>
                ))}
              </div>
              <div className="case-actions">
                <a className="button button-primary" href={contactUrl} target="_blank" rel="noreferrer noopener">
                  Đặt lịch gặp qua Zalo <ArrowRight />
                </a>
                <a className="button button-ghost" href={`mailto:${siteConfig.contactEmail}`}>
                  Gửi email <ArrowUpRight />
                </a>
              </div>
            </div>
            <OfficeSlideshow />
          </div>
        </section>

        <section className="section-pad cta-section" id="demo">
          <div className="container cta-card" data-reveal="scale">
            <div>
              <div className="eyebrow">Sẵn sàng nhìn dữ liệu theo cách khác?</div>
              <h2>Đưa một chiến dịch thật. Locaith dựng luồng demo thật.</h2>
              <p>
                20 phút để nhìn thấy cách Locaith nối dữ liệu, nhận định và hành động cho chính doanh nghiệp bất động
                sản của bạn.
              </p>
            </div>
            <div className="cta-actions" data-stagger="scale">
              <a className="button button-primary" href={contactUrl} target="_blank" rel="noreferrer noopener">
                Liên hệ ngay qua Zalo <ArrowRight />
              </a>
              <a className="button button-ghost" href={siteConfig.homeUrl} target="_blank" rel="noreferrer">
                Xem Locaith.com <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
      </main>

      <FloatingWidgets />

      <footer>
        <div className="container footer-grid" data-stagger="lift">
          <div className="footer-brand">
            <div className="wordmark">
              <img className="wordmark-logo" src="/logo-locaith.png" alt="Logo Locaith" width="28" height="28" />
              <span>LOCAITH</span>
              <small>AI BĐS</small>
            </div>
            <p>
              Locaith Solution Tech là doanh nghiệp công nghệ Việt Nam nghiên cứu và ứng dụng trí tuệ nhân tạo vào các
              quy trình nghiệp vụ của doanh nghiệp, cơ quan hành chính và đời sống.
            </p>
            <ul className="footer-badges">
              <li>Top 4 Google Startup Boost Camp 2025</li>
              <li>50.000+ người dùng</li>
              <li>Thành viên NIC</li>
            </ul>
          </div>

          <nav className="footer-col" aria-label="Hệ sinh thái sản phẩm">
            <h4>Hệ sinh thái</h4>
            <ul>
              <li><a href="https://locaith.com" target="_blank" rel="noreferrer noopener">Locaith Chat — trợ lý AI</a></li>
              <li><a href="https://convert.locaith.com" target="_blank" rel="noreferrer noopener">Locaith Convert — chuyển đổi &amp; dịch tài liệu</a></li>
              <li><a href="https://locaith.com" target="_blank" rel="noreferrer noopener">Locaith OS — hệ điều hành cho Agent AI</a></li>
              <li><a href="https://locaith.com" target="_blank" rel="noreferrer noopener">Compose Word — soạn thảo chuẩn Nghị định 30</a></li>
              <li><a href="https://locaith.com" target="_blank" rel="noreferrer noopener">Design Studio — thiết kế bằng AI</a></li>
            </ul>
          </nav>

          <div className="footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li>NIC — Trung tâm Đổi mới Sáng tạo Quốc gia, 7 Tôn Thất Thuyết, Hà Nội</li>
              <li>Số 1 Hoàng Đạo Thúy, Thanh Xuân, Hà Nội</li>
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
              </li>
              <li>Thứ 2 – Thứ 6: 8:00 – 18:00 · Thứ 7: 8:00 – 12:00</li>
            </ul>
          </div>

          <nav className="footer-col" aria-label="Thông tin và pháp lý">
            <h4>Thông tin</h4>
            <ul>
              <li><a href="https://locaith.com/about" target="_blank" rel="noreferrer noopener">Giới thiệu Locaith</a></li>
              <li><a href="https://locaith.com/contact" target="_blank" rel="noreferrer noopener">Liên hệ hợp tác</a></li>
              <li><a href="https://locaith.com/privacy-policy" target="_blank" rel="noreferrer noopener">Chính sách bảo mật</a></li>
              <li><a href="https://locaith.com/terms" target="_blank" rel="noreferrer noopener">Điều khoản sử dụng</a></li>
              <li><a href="https://m.me/803194724875408" target="_blank" rel="noreferrer noopener">Nhắn tin qua Messenger</a></li>
            </ul>
          </nav>
        </div>

        <div className="container footer-legal">
          <p>© 2026 Locaith Solution Tech. Bảo lưu mọi quyền.</p>
          <p>Nền tảng đo lường và tự động hoá Marketing Bất động sản</p>
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
  contactUrl,
  stuck,
}: {
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
  contactUrl: string
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
          <a href="#dat-lich" onClick={close}>
            Đặt lịch
          </a>
          <a className="nav-cta" href={contactUrl} target="_blank" rel="noreferrer noopener" onClick={close}>
            Liên hệ ngay <ArrowUpRight />
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

function Hero({ contactUrl }: { contactUrl: string }) {
  const deviceRef = useRef<HTMLDivElement>(null)

  // Ghi thẳng vào style thay vì qua state: nghiêng theo con trỏ mà dựng lại cây
  // phần tử ở mỗi lần chuột nhích là thừa và gây giật.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let next = { x: 0, y: 0 }

    const onMove = (event: PointerEvent) => {
      next = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const node = deviceRef.current
        if (!node) return
        node.style.setProperty('--tx', String(next.x))
        node.style.setProperty('--ty', String(next.y))
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const hero = beats[0]

  return (
    <section className="hero" id="dau-trang">
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="container hero-inner cinema">
        <KineticText
          as="div"
          className="eyebrow eyebrow-accent"
          startDelay={260}
          typeMs={20}
          cycleMs={HERO_CYCLE}
          segments={HERO_EYEBROW}
        />
        <h1 className="hero-title">
          <KineticText
            as="span"
            className="hero-line"
            startDelay={1150}
            typeMs={34}
            cycleMs={HERO_CYCLE}
            segments={HERO_LINE_1}
          />
          <KineticText
            as="span"
            className="hero-line"
            startDelay={1900}
            riseMs={145}
            cycleMs={HERO_CYCLE}
            segments={HERO_LINE_2}
          />
        </h1>
        <KineticText
          as="p"
          className="lead hero-lead"
          startDelay={2700}
          typeMs={11}
          riseMs={90}
          cycleMs={HERO_CYCLE}
          segments={HERO_LEAD}
        />
        <div className="hero-actions">
          <a className="button button-primary" href="#san-pham">
            Xem sản phẩm <ArrowRight />
          </a>
          <a className="button button-ghost" href={contactUrl} target="_blank" rel="noreferrer noopener">
            Liên hệ ngay <ArrowUpRight />
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
        <div className="hero-device" ref={deviceRef}>
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
