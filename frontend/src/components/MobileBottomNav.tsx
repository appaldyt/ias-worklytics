'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarConfig, type UserRole } from '@/components/sidebarConfig'

type Props = {
  role: UserRole
}

const shortLabel = (label: string) => {
  const map: Record<string, string> = {
    'Tenant Management': 'Tenant',
    'Master Data': 'Master',
    'User & Role': 'User',
    'Global Reference': 'Global',
    'Kertas Kerja ABK': 'ABK',
    'Template ABK': 'Template',
  }
  return map[label] || label
}

export default function MobileBottomNav({ role }: Props) {
  const pathname = usePathname()

  // Ambil max 5 item pertama agar nyaman di mobile
  const sections = sidebarConfig[role] || []
  const merged: typeof sections[number]['items'] = []
  for (const section of sections) {
    for (const item of section.items) merged.push(item)
  }
  const items = merged.slice(0, 5)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-soft bg-white/95 backdrop-blur">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length || 1}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 text-[11px] ${
                active ? 'text-brand-600' : 'text-secondaryText'
              }`}
            >
              <span className={`text-base ${active ? '' : 'opacity-80'}`}>{item.icon || '•'}</span>
              <span className="mt-0.5 leading-none">{shortLabel(item.label)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
