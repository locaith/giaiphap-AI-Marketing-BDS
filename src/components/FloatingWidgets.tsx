import { useEffect } from 'react'
import { siteConfig } from '../config'

const PHENAU_SCRIPT_ID = 'phenau-widget'

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
 * Hai kênh liên hệ nổi ở chân màn hình: Zalo Official Account bên trái, trợ lý
 * hội thoại bên phải — đặt hai bên để không đè lên nhau.
 */
export function FloatingWidgets() {
  useEffect(() => {
    if (!document.getElementById(PHENAU_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = PHENAU_SCRIPT_ID
      script.async = true
      script.src =
        `${siteConfig.phenauBaseUrl}/api/widget/agents/embed.js` +
        `?agentId=${siteConfig.phenauAgentId}&position=bottom-right&color=%230d2438`
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

  return (
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
