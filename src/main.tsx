import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Trang này là Vite + React thuần nên dùng nhánh /react của gói đo lường.
// Bản hướng dẫn trên Vercel mặc định là cho Remix hoặc Next.js, import khác đường dẫn.
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
