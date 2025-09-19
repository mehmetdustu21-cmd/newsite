import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EasyChat | Kontrol Paneli',
  description: 'Sohbet operasyonlarınızı tek ekrandan yönetin.'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
