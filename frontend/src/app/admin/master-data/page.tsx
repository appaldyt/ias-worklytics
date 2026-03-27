'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'

export default function AdminMasterDataPage() {
  const [tenantName, setTenantName] = useState('Tenant')

  useEffect(() => {
    const tenant = localStorage.getItem('tenant')
    if (tenant) {
      try {
        const parsed = JSON.parse(tenant)
        setTenantName(parsed.name || 'Tenant')
      } catch {}
    }
  }, [])

  return (
    <AppShell role="admin" title="Admin — Master Data" subtitle={`Kelola master data untuk ${tenantName}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="panel-card">
          <p className="muted">Total Karyawan</p>
          <p className="kpi-value">—</p>
        </div>
        <div className="panel-card">
          <p className="muted">Departemen</p>
          <p className="kpi-value">—</p>
        </div>
        <div className="panel-card">
          <p className="muted">Template ABK</p>
          <p className="kpi-value">—</p>
        </div>
        <div className="panel-card">
          <p className="muted">Status Tenant</p>
          <p className="text-2xl font-bold text-green-600">Active</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="panel-card">
          <h2 className="font-semibold mb-2">Departemen</h2>
          <p className="muted">Kelola struktur departemen tenant.</p>
        </section>
        <section className="panel-card">
          <h2 className="font-semibold mb-2">Karyawan</h2>
          <p className="muted">Kelola data karyawan tenant.</p>
        </section>
        <section className="panel-card">
          <h2 className="font-semibold mb-2">Template ABK</h2>
          <p className="muted">Atur format kertas kerja ABK tenant.</p>
        </section>
      </div>
    </AppShell>
  )
}
