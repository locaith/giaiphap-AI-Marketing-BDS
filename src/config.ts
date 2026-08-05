export const siteConfig = {
  productName: 'Locaith AI Marketing',
  productTagline: 'Giải pháp AI Marketing cho Bất động sản',
  homeUrl: 'https://locaith.com',
  landingUrl: 'https://ai-bds.locaith.com',
  contactEmail: 'locaithsolution@locaith.com',
  demoSubject: 'Đăng ký demo giải pháp AI Marketing Bất động sản',
  caseStudyName: 'Reti Home',
  caseStudyPublic: true,
} as const

export function buildDemoMailto() {
  const body = [
    'Chào Locaith,',
    '',
    'Tôi muốn xem demo giải pháp AI Marketing cho doanh nghiệp bất động sản.',
    '',
    'Công ty:',
    'Số điện thoại:',
    'Bài toán cần giải quyết:',
  ].join('\n')

  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    siteConfig.demoSubject,
  )}&body=${encodeURIComponent(body)}`
}
