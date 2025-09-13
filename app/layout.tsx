import './globals.css'
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata = {
  title: 'EasyChat - İşletmenizi Dijitalleştirin',
  description: 'WhatsApp, web ve mobil platformlarında akıllı chat asistanı ile müşteri deneyiminizi üst seviyeye taşıyın.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={poppins.className}>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
