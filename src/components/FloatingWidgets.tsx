import { useEffect, useState } from 'react'
import { siteConfig } from '../config'

const PHENAU_SCRIPT_ID = 'phenau-widget'
const ZALO_SCRIPT_ID = 'zalo-sdk'

/** Thay biểu tượng mặc định của nút chat bằng logo Locaith. */
function brandChatButton() {
  const button = document.querySelector<HTMLButtonElement>('#phechat-agent-widget-container button')
  if (!button || button.dataset.branded === 'true') return false

  button.dataset.branded = 'true'
  button.innerHTML =
    '<img src="/logo-locaith.png" alt="" width="34" height="34" style="width:34px;height:34px;border-radius:10px;display:block" />'
  button.setAttribute('aria-label', 'Trò chuyện với trợ lý Locaith')
  return true
}

/**
 * Hai kênh liên hệ nổi ở chân màn hình: khung chat Zalo Official Account bên
 * trái, trợ lý hội thoại bên phải — đặt hai bên để không đè lên nhau.
 *
 * Khung Zalo do SDK của Zalo dựng và mở ngay trong trang. SDK chỉ chạy trên
 * domain đã khai báo ở Zalo Official Account Manager; nếu nó không dựng được
 * widget thì nút dự phòng bên dưới sẽ hiện ra và mở trang OA.
 */
export function FloatingWidgets() {
  const [zaloReady, setZaloReady] = useState(false)
  const [zaloFailed, setZaloFailed] = useState(false)

  useEffect(() => {
    if (!document.getElementById(PHENAU_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = PHENAU_SCRIPT_ID
      script.async = true
      script.src =
        `${siteConfig.phenauBaseUrl}/api/widget/agents/embed.js` +
        `?agentId=${siteConfig.phenauWidgetAgentId}&position=bottom-right&color=%230d2438`
      document.body.appendChild(script)
    }

    // Nút chat do script bên ngoài dựng sau, nên phải đợi rồi mới gắn logo.
    if (brandChatButton()) return

    const observer = new MutationObserver(() => {
      if (brandChatButton()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const stop = window.setTimeout(() => observer.disconnect(), 20000)

    return () => {
      observer.disconnect()
      window.clearTimeout(stop)
    }
  }, [])

  useEffect(() => {
    // Div này phải do DOM thuần tạo: React gắn thuộc tính nội bộ lên node, SDK
    // Zalo đọc node đó rồi JSON.stringify và văng lỗi vòng lặp liên tục.
    let host = document.querySelector<HTMLDivElement>('.zalo-chat-widget')
    if (!host) {
      host = document.createElement('div')
      host.className = 'zalo-chat-widget'
      host.dataset.oaid = siteConfig.zaloOaId
      host.dataset.welcomeMessage = 'Chào bạn, Locaith có thể hỗ trợ gì cho doanh nghiệp bất động sản của bạn?'
      host.dataset.autopopup = '0'
      host.dataset.width = '350'
      host.dataset.height = '420'
      document.body.appendChild(host)
    }

    if (!document.getElementById(ZALO_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = ZALO_SCRIPT_ID
      script.async = true
      script.src = 'https://sp.zalo.me/plugins/sdk.js'
      document.body.appendChild(script)
    }

    // SDK dựng xong thì khung chat có nội dung; quá lâu vẫn rỗng thì coi như hỏng.
    const check = window.setInterval(() => {
      if (host && host.children.length > 0) {
        setZaloReady(true)
        window.clearInterval(check)
      }
    }, 400)

    const giveUp = window.setTimeout(() => {
      window.clearInterval(check)
      if (!host || host.children.length === 0) setZaloFailed(true)
    }, 6000)

    return () => {
      window.clearInterval(check)
      window.clearTimeout(giveUp)
    }
  }, [])

  return (
    <>
      {zaloReady || zaloFailed ? null : <span className="visually-hidden">Đang tải khung chat Zalo</span>}

      {zaloFailed ? (
        <a
          className="zalo-float"
          href={siteConfig.zaloUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Nhắn tin cho Locaith AI qua Zalo Official Account"
        >
          <ZaloMark />
          <span>Chat Zalo</span>
        </a>
      ) : null}
    </>
  )
}

function ZaloMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" width="24" height="24">
      <path
        fill="currentColor"
        d="M24 4C12.4 4 3 12.1 3 22.1c0 5.6 3 10.6 7.7 13.9-.3 2.4-1.3 4.9-3 7.1-.4.5 0 1.2.6 1.1 4.3-.7 7.6-2.6 9.7-4.2 1.9.4 3.9.6 6 .6 11.6 0 21-8.1 21-18.5S35.6 4 24 4Z"
      />
    </svg>
  )
}
