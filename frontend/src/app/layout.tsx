import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IAS Worklytics',
  description: 'Aplikasi Analisis Beban Kerja (ABK) IAS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50">
        <div className="min-h-screen">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-semibold text-gray-900">
                  IAS Worklytics
                </h1>
                <div className="text-sm text-gray-500">
                  Analisis Beban Kerja
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}