import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check } from './Icons'
import { buildChatUrl, siteConfig } from '../config'

export type Lead = {
  name: string
  company: string
  phone: string
  email: string
}

const STORAGE_KEY = 'locaith-lead'

const EMPTY: Lead = { name: '', company: '', phone: '', email: '' }

function readSaved(): Lead | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Lead
    return value?.name && value?.phone ? value : null
  } catch {
    return null
  }
}

/**
 * Khối tư vấn trực tiếp trên trang.
 *
 * Người dùng để lại tên, công ty, số điện thoại và email trước, thông tin đó
 * được lưu lại rồi mới mở khung trò chuyện. Thông tin được gửi sang khung chat
 * theo hai đường: tham số trên địa chỉ khung và `postMessage` sau khi khung tải
 * xong — bên nào trợ lý đọc được thì dùng đường đó.
 */
export function ChatConsult() {
  const [lead, setLead] = useState<Lead | null>(null)
  const [form, setForm] = useState<Lead>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({})
  const [version] = useState(() => Date.now())
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLead(readSaved())
  }, [])

  // Gửi lại thông tin qua postMessage khi khung chat đã tải xong.
  useEffect(() => {
    if (!lead) return
    const frame = frameRef.current
    if (!frame) return

    const send = () => {
      frame.contentWindow?.postMessage(
        { type: 'phechat:context', source: 'locaith-landing', lead },
        siteConfig.phenauBaseUrl,
      )
    }

    frame.addEventListener('load', send)
    const retry = window.setTimeout(send, 2500)
    return () => {
      frame.removeEventListener('load', send)
      window.clearTimeout(retry)
    }
  }, [lead])

  const update = (key: keyof Lead) => (event: { target: { value: string } }) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()

    const next: Partial<Record<keyof Lead, string>> = {}
    if (!form.name.trim()) next.name = 'Cho Locaith xin tên của bạn'
    if (!/^[\d\s+().-]{8,}$/.test(form.phone.trim())) next.phone = 'Số điện thoại chưa đúng'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Email chưa đúng'

    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    const saved: Lead = {
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      /* trình duyệt chặn lưu thì vẫn mở được chat */
    }
    setLead(saved)
  }

  // Container giữ nguyên qua cả hai trạng thái để hiệu ứng hiện dần chỉ chạy một lần.
  return (
    <div className="chat-panel" data-reveal="right" data-delay="1">
      <div className="chat-head">
        <span>Trợ lý dữ liệu Locaith</span>
        <span className="status-dot">Trực tuyến</span>
      </div>

      {lead ? (
        <>
          <div className="chat-hello">
            <Check />
            Chào {lead.name}
            {lead.company ? ` · ${lead.company}` : ''} — hỏi thử trợ lý bất kỳ điều gì về giải pháp.
          </div>
          <iframe
            ref={frameRef}
            className="chat-frame"
            title="Trợ lý dữ liệu Locaith"
            src={buildChatUrl(lead, version)}
          />
          <button
            className="chat-reset"
            type="button"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY)
              setForm(EMPTY)
              setLead(null)
            }}
          >
            Đổi thông tin liên hệ
          </button>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <h3 className="chat-title">Nhập thông tin để nói chuyện thử với AI</h3>
          <p className="chat-intro">
            Trợ lý trả lời ngay trong trang. Locaith cần vài thông tin để liên hệ lại sau cuộc trò chuyện.
          </p>

          <div className="chat-fields">
            <label>
              <span>Họ và tên *</span>
              <input value={form.name} onChange={update('name')} autoComplete="name" />
              {errors.name ? <em>{errors.name}</em> : null}
            </label>
            <label>
              <span>Công ty</span>
              <input value={form.company} onChange={update('company')} autoComplete="organization" />
            </label>
            <label>
              <span>Số điện thoại *</span>
              <input value={form.phone} onChange={update('phone')} autoComplete="tel" inputMode="tel" />
              {errors.phone ? <em>{errors.phone}</em> : null}
            </label>
            <label>
              <span>Email *</span>
              <input value={form.email} onChange={update('email')} autoComplete="email" inputMode="email" />
              {errors.email ? <em>{errors.email}</em> : null}
            </label>
          </div>

          <button className="button button-primary chat-submit" type="submit">
            Nói chuyện thử với AI <ArrowRight />
          </button>
          <p className="chat-note">Thông tin chỉ dùng để Locaith liên hệ tư vấn, không chia sẻ cho bên thứ ba.</p>
        </form>
      )}
    </div>
  )
}
