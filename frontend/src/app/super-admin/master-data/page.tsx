'use client'

import { useEffect, useState } from 'react'

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
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Super Admin - Master Data</h1>
      <p className="text-gray-600">Selamat datang, {userName}. Anda dapat mengelola semua tenant.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Tenant Management</h2>
          <p className="text-sm text-gray-600">Kelola semua tenant IAS Group.</p>
        </section>
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">User & Role Management</h2>
          <p className="text-sm text-gray-600">Atur role Super Admin, Admin, Karyawan.</p>
        </section>
        <section className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Global Master Data</h2>
          <p className="text-sm text-gray-600">Data referensi lintas tenant.</p>
        </section>
      </div>
    </main>
  )
}
