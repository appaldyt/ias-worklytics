'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type AppShellProps = {
  role: 'super_admin' | 'admin' | 'karyawan'
  title: string
  subtitle?: string
  children: React.ReactNode
}

const menuByRole: Record<AppShellProps['role'], { label: string; href: string }[]> = {
  super_admin: [
    { label: 'Master Data', href: '/super-admin/master-data' },
    { label: 'Tenant', href: '/super-admin/master-data' },
  ],
  admin: [
    { label: 'Master Data', href: '/admin/master-data' },
    { label: 'Karyawan', href: '/admin/master-data' },
  ],
  karyawan: [
    { label: 'Kertas Kerja ABK', href: '/karyawan/abk-worksheet' },
  ],
}

export default function AppShell({ role, title, subtitle, children }: AppShellProps) {
  const pathname = usePathname()
  const menus = menuByRole[role]

  return (
    <div className="min-h-screen bg-app">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-soft p-4 flex-col">
          <div className="px-3 py-2 mb-4">
            <h2 className="text-lg font-semibold text-primaryText">IAS Worklytics</h2>
            <p className="text-xs text-secondaryText uppercase tracking-wide">{role.replace('_', ' ')}</p>
          </div>

          <nav className="space-y-1">
            {menus.map((menu) => {
              const active = pathname === menu.href
              return (
                <Link
                  key={menu.href + menu.label}
                  href={menu.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-secondaryText hover:bg-brand-soft hover:text-brand-600'
                  }`}
                >
                  {menu.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-soft">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-primaryText">{title}</h1>
                {subtitle ? <p className="text-sm text-secondaryText">{subtitle}</p> : null}
              </div>
              <div className="text-xs md:text-sm text-secondaryText">IAS Worklytics</div>
            </div>
          </header>

          <main className="p-4 md:p-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
