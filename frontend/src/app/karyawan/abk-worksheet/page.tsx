'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'

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
    <AppShell role="karyawan" title="Kertas Kerja ABK" subtitle={`Halo ${userName}, isi aktivitas kerja Anda.`}>
      <section className="panel-card space-y-3 max-w-3xl">
        <label className="block text-sm font-medium text-primaryText">Nama Aktivitas</label>
        <input className="w-full border border-soft rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Contoh: Penyusunan laporan operasional" />

        <label className="block text-sm font-medium text-primaryText">Durasi (jam)</label>
        <input type="number" className="w-full border border-soft rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Contoh: 2" />

        <label className="block text-sm font-medium text-primaryText">Output</label>
        <textarea className="w-full border border-soft rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={4} placeholder="Hasil kerja / output aktivitas"></textarea>

        <button className="btn btn-primary">Simpan Kertas Kerja</button>
      </section>
    </AppShell>
  )
}
