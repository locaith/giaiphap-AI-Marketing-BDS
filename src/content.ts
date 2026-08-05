export type Beat = {
  id: string
  tag: string
  index: string
  title: string
  /** Cụm trong tiêu đề được tô màu và gạch chân. Phải là một đoạn có trong title. */
  accent?: string
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
    title: 'Từng số điện thoại truy ra đúng chiến dịch.',
    accent: 'đúng chiến dịch',
    text: 'Khách để lại thông tin ở quảng cáo nào, quan tâm loại hình gì, đang ở giai đoạn nào và hợp đồng bao nhiêu — nằm trên cùng một dòng.',
    image: '/exhibits/leads.webp',
    imageSmall: '/exhibits/leads@720.webp',
    width: 1212,
    height: 807,
    path: 'khách hàng từ quảng cáo',
    alt: 'Bảng khách hàng gắn với chiến dịch quảng cáo, kèm số điện thoại, nhu cầu, giai đoạn và giá trị hợp đồng',
  },
  {
    id: 'hieu-qua',
    tag: 'Hiệu quả',
    index: '02',
    title: 'Từ chi phí cho đến doanh thu.',
    accent: 'doanh thu',
    text: 'Ngân sách đã tiêu, số khách thu được, số hợp đồng đã chốt và doanh thu tương ứng, xếp cạnh nhau theo từng dự án.',
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
    title: 'Tải báo cáo ngay khi có dữ liệu.',
    accent: 'ngay khi có dữ liệu',
    text: 'Cùng một bộ số cho mọi kỳ, tải về nhập thẳng vào phần mềm quản lý khách hàng, không phải ghép tay từng file.',
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
    title: 'Truy vấn dữ liệu với AI Agent.',
    accent: 'Truy vấn dữ liệu',
    text: 'Câu trả lời luôn đi cùng dữ liệu đã dùng để tạo ra nó, nên kiểm chứng được thay vì phải tin suông.',
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
    title: 'Thấy rõ được chiến lược hiệu quả nhất.',
    accent: 'chiến lược hiệu quả nhất',
    text: 'Khuyến nghị xếp hạng theo chi phí mỗi khách, lượng khách thu được và khả năng hấp thụ ngân sách — mỗi ý dẫn ngược về con số phía trên.',
    image: '/exhibits/recommendations.webp',
    imageSmall: '/exhibits/recommendations@720.webp',
    width: 1217,
    height: 965,
    path: 'khuyến nghị ngân sách',
    alt: 'Khuyến nghị tăng ngân sách cho dự án hiệu quả và dừng chiến dịch không ra khách hàng',
  },
]

/**
 * Bốn bước chuẩn hoá, đi liền một mạch từ đồng quảng cáo đầu tiên tới hợp đồng
 * cuối cùng. Mô tả bám đúng việc hệ thống đang làm, không hứa thêm.
 */
export const dataChain = [
  {
    title: 'Gom về một mối',
    text: 'Quảng cáo, form đăng ký, tin nhắn, cuộc gọi, phần mềm quản lý khách hàng và file Excel của từng sàn đổ về cùng một nơi.',
  },
  {
    title: 'Một bộ định nghĩa duy nhất',
    text: 'Thế nào là khách đủ điều kiện, thế nào là hợp đồng đã chốt — chốt một lần rồi áp cho mọi kỳ báo cáo và mọi bộ phận.',
  },
  {
    title: 'Khử trùng lặp theo số điện thoại',
    text: 'Một người để lại thông tin ở nhiều chiến dịch vẫn chỉ tính là một khách, nên số liệu không bị cộng dồn ảo.',
  },
  {
    title: 'Nối khoản chi với doanh thu',
    text: 'Mỗi hợp đồng truy được ra đúng chiến dịch và đúng số tiền đã bỏ ra, nên chi phí và doanh thu nằm trên cùng một bảng thay vì hai file rời.',
  },
]

export type ModelProvider = {
  name: string
  role: string
  /** Logo thật của nhà cung cấp, đặt trong public/logos/. */
  logo?: string
  /** Tỷ lệ gốc của file logo — giữ đúng để ảnh không bị méo và không nhảy layout. */
  ratio?: number
  /** Nhà cung cấp chưa có logo dùng lại được thì vẽ dấu hiệu riêng. */
  mark?: 'private'
}

export const models: ModelProvider[] = [
  { name: 'Claude', role: 'Phân tích sâu', logo: '/logos/claude.svg', ratio: 1 },
  { name: 'GPT', role: 'Tác vụ tổng quát', logo: '/logos/openai.svg', ratio: 1 },
  { name: 'Gemini', role: 'Hệ sinh thái Google', logo: '/logos/gemini.svg', ratio: 1 },
  { name: 'Seedance', role: 'Sinh video · ByteDance', logo: '/logos/bytedance.svg', ratio: 5.8 },
  { name: 'Mô hình riêng', role: 'Chạy trong hạ tầng nội bộ', mark: 'private' },
]

export const signals = ['Quảng cáo', 'Khách hàng', 'Tư vấn', 'Hợp đồng', 'Doanh thu', 'Báo cáo']
