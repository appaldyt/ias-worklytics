export type UserRole = 'super_admin' | 'admin' | 'karyawan'

export type SidebarItem = {
  label: string
  href: string
  icon?: string
  comingSoon?: boolean
}

export type SidebarSection = {
  title: string
  items: SidebarItem[]
}

/**
 * Single source of truth untuk sidebar.
 * Jika ada fitur/menu baru, tambahkan di sini sesuai role.
 */
export const sidebarConfig: Record<UserRole, SidebarSection[]> = {
  super_admin: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Tenant Management', href: '/super-admin/master-data', icon: '🏢' },
      ],
    },
    {
      title: 'MASTER',
      items: [
        { label: 'User & Role', href: '/super-admin/users-roles', icon: '👥' },
        { label: 'Global Reference', href: '/super-admin/master-data', icon: '🧩', comingSoon: true },
      ],
    },
  ],
  admin: [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Master Data', href: '/admin/master-data', icon: '📊' },
      ],
    },
    {
      title: 'TENANT DATA',
      items: [
        { label: 'Departemen', href: '/admin/master-data', icon: '🏬', comingSoon: true },
        { label: 'Karyawan', href: '/admin/master-data', icon: '🧑‍💼', comingSoon: true },
        { label: 'Template ABK', href: '/admin/master-data', icon: '📝', comingSoon: true },
      ],
    },
  ],
  karyawan: [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Kertas Kerja ABK', href: '/karyawan/abk-worksheet', icon: '🧾' },
      ],
    },
    {
      title: 'LAINNYA',
      items: [
        { label: 'Riwayat ABK', href: '/karyawan/abk-worksheet', icon: '📚', comingSoon: true },
      ],
    },
  ],
}
