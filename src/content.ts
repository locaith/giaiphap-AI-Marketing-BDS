export type Beat = {
  id: string
  tag: string
  index: string
  title: string
  text: string
  image: string
  imageSmall: string
  width: number
  height: number
  path: string
  alt: string
}

/**
 * Kịch bản cuộn. Mỗi nhịp = một bước cuộn = một câu ngắn.
 * Ảnh là màn hình thật của sản phẩm, bóc từ phụ lục bản kế hoạch triển khai.
 */
export const beats: Beat[] = [
  {
    id: 'truy-nguyen',
    tag: 'Truy nguyên',
    index: '01',
    title: 'Mỗi khách hàng biết rõ mình đến từ quảng cáo nào.',
    text: 'Tên, số điện thoại, nhu cầu, giai đoạn và giá trị hợp đồng — gắn thẳng vào chiến dịch đã sinh ra khách hàng đó.',
    image: '/exhibits/leads.webp',
    imageSmall: '/exhibits/leads@720.webp',
    width: 1212,
    height: 807,
    path: 'khách hàng từ quảng cáo',
    alt: 'Bảng khách hàng gắn với chiến dịch quảng cáo, kèm chi phí, giai đoạn và giá trị hợp đồng',
  },
  {
    id: 'hieu-qua',
    tag: 'Hiệu quả',
    index: '02',
    title: 'Chi phí, khách hàng, hợp đồng, doanh thu — cùng một định nghĩa.',
    text: 'Từng chiến dịch được tính trên đúng bộ định nghĩa đã thống nhất, không còn hai bảng số khác nhau giữa marketing và kinh doanh.',
    image: '/exhibits/performance.webp',
    imageSmall: '/exhibits/performance@720.webp',
    width: 1217,
    height: 862,
    path: 'hiệu quả chiến dịch',
    alt: 'Bảng hiệu quả chiến dịch với chi phí, số khách hàng, hợp đồng đã chốt và doanh thu',
  },
  {
    id: 'bao-cao',
    tag: 'Báo cáo',
    index: '03',
    title: 'Ngày, tuần, tháng, quý. Tải Excel là xong.',
    text: 'Cùng một bộ số cho mọi kỳ báo cáo, tải về và nhập thẳng vào phần mềm quản lý khách hàng — không phải ghép tay từng file.',
    image: '/exhibits/reports.webp',
    imageSmall: '/exhibits/reports@720.webp',
    width: 1214,
    height: 749,
    path: 'báo cáo theo kỳ',
    alt: 'Danh sách kỳ báo cáo theo ngày, tuần, tháng, quý kèm nút tải Excel',
  },
  {
    id: 'hoi-dap',
    tag: 'Hỏi đáp',
    index: '04',
    title: 'Hỏi bằng tiếng Việt. Trả lời kèm bảng số.',
    text: 'Câu trả lời luôn đi cùng bảng dữ liệu đã dùng để tạo ra nó, nên có thể kiểm chứng thay vì phải tin suông.',
    image: '/exhibits/ask.webp',
    imageSmall: '/exhibits/ask@720.webp',
    width: 1229,
    height: 967,
    path: 'hỏi đáp dữ liệu',
    alt: 'Báo cáo phân tích ngân sách được tạo ra từ một câu hỏi bằng tiếng Việt',
  },
  {
    id: 'quyet-dinh',
    tag: 'Quyết định',
    index: '05',
    title: 'Nên dồn ngân sách vào đâu. Nên dừng ở đâu.',
    text: 'Khuyến nghị xếp hạng theo chi phí mỗi khách hàng, khối lượng khách hàng và khả năng hấp thụ ngân sách — mỗi ý đều dẫn ngược về con số phía trên.',
    image: '/exhibits/recommendations.webp',
    imageSmall: '/exhibits/recommendations@720.webp',
    width: 1217,
    height: 965,
    path: 'khuyến nghị ngân sách',
    alt: 'Khuyến nghị tăng ngân sách cho dự án hiệu quả và dừng chiến dịch không ra khách hàng',
  },
]

export const pains = [
  'Dữ liệu quảng cáo nằm riêng một nơi, dữ liệu khách hàng và báo cáo bán hàng nằm một nơi khác.',
  'Báo cáo làm tay luôn chậm hơn nhịp thay đổi của chiến dịch.',
  'Nội dung, hình ảnh và video phải sản xuất với tốc độ ngày càng cao.',
  'Lãnh đạo có dữ liệu nhưng vẫn khó đặt câu hỏi và nhận câu trả lời ngay.',
]

export type ModelProvider = {
  name: string
  role: string
  /** Logo thật của nhà cung cấp, đặt trong public/logos/. */
  logo?: string
  /** Tỷ lệ gốc của file logo — giữ đúng để ảnh không bị méo và không nhảy layout. */
  ratio?: number
  /** Nhà cung cấp chưa có logo dùng lại được thì vẽ dấu hiệu riêng. */
  mark?: 'kimi' | 'private'
}

export const models: ModelProvider[] = [
  { name: 'Claude', role: 'Phân tích sâu', logo: '/logos/claude.svg', ratio: 1 },
  { name: 'GPT', role: 'Tác vụ tổng quát', logo: '/logos/openai.svg', ratio: 1 },
  { name: 'Gemini', role: 'Hệ sinh thái Google', logo: '/logos/gemini.svg', ratio: 1 },
  { name: 'Kimi', role: 'Ngữ cảnh dài', mark: 'kimi' },
  { name: 'Seedance', role: 'Sinh video · ByteDance', logo: '/logos/bytedance.svg', ratio: 5.8 },
  { name: 'Mô hình riêng', role: 'Chạy trong hạ tầng nội bộ', mark: 'private' },
]

export const signals = ['Quảng cáo', 'Khách hàng', 'Tư vấn', 'Hợp đồng', 'Doanh thu', 'Báo cáo']
