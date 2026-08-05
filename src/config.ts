export const siteConfig = {
  productName: 'Locaith AI Marketing',
  productTagline: 'Giải pháp AI Marketing cho Bất động sản',
  homeUrl: 'https://locaith.com',
  landingUrl: 'https://ai-bds.locaith.com',
  contactEmail: 'locaithsolution@locaith.com',

  /** Zalo Official Account của Locaith AI. */
  zaloOaId: '1864346228925847963',
  zaloUrl: 'https://zalo.me/1864346228925847963',

  phenauBaseUrl: 'https://phenau.com',

  /** Trợ lý cho nút nổi ở góc màn hình. */
  phenauWidgetAgentId: '34df70ef-8edb-414f-bdea-b14d91024a1a',

  /** Trợ lý cho khung trò chuyện thử ngay trong phần Tư vấn. */
  phenauChatAgentId: '0360da18-2ea5-4424-ae73-e6dfc056a21e',
} as const

/** Địa chỉ khung chat nhúng, kèm thông tin người dùng vừa để lại nếu có. */
export function buildChatUrl(
  lead?: { name: string; company: string; phone: string; email: string },
  version?: number,
) {
  const url = new URL(`${siteConfig.phenauBaseUrl}/agents/${siteConfig.phenauChatAgentId}/public`)
  url.searchParams.set('embed', '1')
  if (version) url.searchParams.set('v', String(version))
  if (lead) {
    url.searchParams.set('name', lead.name)
    url.searchParams.set('company', lead.company)
    url.searchParams.set('phone', lead.phone)
    url.searchParams.set('email', lead.email)
  }
  return url.toString()
}

