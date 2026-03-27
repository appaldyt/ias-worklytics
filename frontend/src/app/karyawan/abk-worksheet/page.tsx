'use client'

import { useEffect, useState } from 'react'

export default function KaryawanABKWorksheetPage() {
  const [userName, setUserName] = useState('Karyawan')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const parsed = JSON.parse(user)
        setUserName(parsed.full_name || 'Karyawan')
      } catch {}
    }
  }, [])

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kertas Kerja ABK</h1>
      <p className="text-gray-600">Halo {userName}, isi kertas kerja ABK Anda di sini.</p>

      <section className="bg-white border rounded-lg p-4 space-y-3">
        <label className="block text-sm font-medium">Nama Aktivitas</label>
        <input className="w-full border rounded px-3 py-2" placeholder="Contoh: Penyusunan laporan operasional" />

        <label className="block text-sm font-medium">Durasi (jam)</label>
        <input type="number" className="w-full border rounded px-3 py-2" placeholder="Contoh: 2" />

        <label className="block text-sm font-medium">Output</label>
        <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Hasil kerja / output aktivitas"></textarea>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan Kertas Kerja</button>
      </section>
    </main>
  )
}
