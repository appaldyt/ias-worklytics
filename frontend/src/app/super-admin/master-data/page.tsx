'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'

export default function SuperAdminMasterDataPage() {
  const [userName, setUserName] = useState('Super Admin')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const parsed = JSON.parse(user)
        setUserName(parsed.full_name || 'Super Admin')
      } catch {}
    }
  }, [])

  return (
    <AppShell
      role="super_admin"
      title="Super Admin — Master Data"
      subtitle={`Selamat datang, ${userName}. Kelola seluruh tenant.`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="panel-card">
          <p className="muted">Total Tenant</p>
          <p className="kpi-value">6</p>
        </div>
        <div className="panel-card">
          <p className="muted">User Aktif</p>
          <p className="kpi-value">—</p>
        </div>
        <div className="panel-card">
          <p className="muted">Admin Tenant</p>
          <p className="kpi-value">6</p>
        </div>
        <div className="panel-card">
          <p className="muted">Status Sistem</p>
          <p className="text-2xl font-bold text-green-600">Healthy</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="panel-card">
          <h2 className="font-semibold mb-2">Tenant Management</h2>
          <p className="muted">Kelola tenant IAS Group (buat, ubah, nonaktifkan).</p>
        </section>
        <section className="panel-card">
          <h2 className="font-semibold mb-2">User & Role Management</h2>
          <p className="muted">Atur role Super Admin / Admin / Karyawan lintas tenant.</p>
        </section>
        <section className="panel-card">
          <h2 className="font-semibold mb-2">Global Master Data</h2>
          <p className="muted">Standar data ABK, kategori aktivitas, dan referensi global.</p>
        </section>
      </div>
    </AppShell>
  )
}
