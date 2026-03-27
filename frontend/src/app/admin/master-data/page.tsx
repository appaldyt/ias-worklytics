'use client'

import { useEffect, useState } from 'react'

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
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin - Master Data</h1>
      <p className="text-gray-600">Anda mengelola master data untuk: {tenantName}</p>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Departemen</h2>
          <p className="text-sm text-gray-600">Kelola struktur departemen tenant.</p>
        </section>
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Karyawan</h2>
          <p className="text-sm text-gray-600">Kelola data karyawan tenant.</p>
        </section>
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Template ABK</h2>
          <p className="text-sm text-gray-600">Atur template kerja ABK tenant.</p>
        </section>
      </div>
    </main>
  )
}
