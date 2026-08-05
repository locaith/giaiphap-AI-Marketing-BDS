export const siteConfig = {
  productName: 'Locaith AI Marketing',
  productTagline: 'Giải pháp AI Marketing cho Bất động sản',
  homeUrl: 'https://locaith.com',
  landingUrl: 'https://ai-bds.locaith.com',
  contactEmail: 'locaithsolution@locaith.com',
  caseStudyName: 'Reti Home',
  caseStudyPublic: true,

  /** Zalo Official Account của Locaith AI. */
  zaloOaId: '1864346228925847963',
  zaloUrl: 'https://zalo.me/1864346228925847963',

  /** Trợ lý hội thoại Phê Nâu nhúng trong trang. */
  phenauAgentId: '34df70ef-8edb-414f-bdea-b14d91024a1a',
  phenauBaseUrl: 'https://phenau.com',
} as const

/** Địa chỉ khung chat nhúng, kèm thông tin người dùng vừa để lại nếu có. */
export function buildChatUrl(lead?: { name: string; company: string; phone: string; email: string }) {
  const url = new URL(`${siteConfig.phenauBaseUrl}/agents/${siteConfig.phenauAgentId}/public`)
  url.searchParams.set('embed', '1')
  url.searchParams.set('widget', '1')
  if (lead) {
    url.searchParams.set('name', lead.name)
    url.searchParams.set('company', lead.company)
    url.searchParams.set('phone', lead.phone)
    url.searchParams.set('email', lead.email)
  }
  return url.toString()
}

