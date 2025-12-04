import './globals.css'
import FaviconHandler from './components/FaviconHandler'

export const metadata = {
  title: 'Elite Properties - Real Estate Portfolio',
  description: 'Portfolio website for real estate agents',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FaviconHandler />
        {children}
      </body>
    </html>
  )
}

