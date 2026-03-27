'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AppShell from '@/components/AppShell'
import SectionHeader from '@/components/ui/SectionHeader'
import FormCard from '@/components/ui/FormCard'
import DataTableCard from '@/components/ui/DataTableCard'

type Verb = {
  id: number
  word: string
  category: string
  level: string
  description?: string
  is_active: boolean
}

const empty = {
  word: '',
  category: 'spesialis',
  level: 'staff',
  description: '',
  is_active: true,
}

const levels = ['all', 'bod', 'kepala_divisi', 'kepala_departemen', 'kepala_bagian', 'staff']
const categories = ['strategis', 'manajerial', 'spesialis', 'dilarang']

export default function GlobalReferencePage() {
  const [rows, setRows] = useState<Verb[]>([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    load()
  }, [])

  const load = async () => {
    try {
      const res = await axios.get<Verb[]>('/api/admin/global-verbs')
      setRows(Array.isArray(res.data) ? res.data : [])
      setError(null)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal memuat global kata kerja')
    }
  }

  const reset = () => {
    setEditId(null)
    setForm(empty)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      if (editId) {
        await axios.put(`/api/admin/global-verbs/${editId}`, form)
        setSuccess('Kata kerja berhasil diperbarui')
      } else {
        await axios.post('/api/admin/global-verbs', form)
        setSuccess('Kata kerja berhasil ditambahkan')
      }
      reset()
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menyimpan data')
    }
  }

  const edit = (row: Verb) => {
    setEditId(row.id)
    setForm({
      word: row.word,
      category: row.category,
      level: row.level,
      description: row.description || '',
      is_active: row.is_active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id: number) => {
    if (!confirm('Hapus kata kerja ini?')) return
    try {
      await axios.delete(`/api/admin/global-verbs/${id}`)
      setSuccess('Kata kerja dihapus')
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menghapus data')
    }
  }

  const seedDefault = async () => {
    try {
      await axios.post('/api/admin/global-verbs/seed-default')
      setSuccess('Seed default berhasil dijalankan')
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal seed default')
    }
  }

  return (
    <AppShell role="super_admin" title="Super Admin — Global Reference" subtitle="Master global kata kerja untuk aktivitas ABK">
      <SectionHeader
        title="Global Kata Kerja"
        subtitle="Data ini dipakai lintas tenant untuk menyusun aktivitas ABK"
        right={<button className="btn btn-secondary" onClick={seedDefault}>Seed Default</button>}
      />

      <FormCard title={editId ? 'Edit Kata Kerja' : 'Tambah Kata Kerja'}>
        {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kata Kerja</label>
            <input value={form.word} onChange={(e) => setForm(v => ({ ...v, word: e.target.value }))} required className="w-full border border-soft rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select value={form.category} onChange={(e) => setForm(v => ({ ...v, category: e.target.value }))} className="w-full border border-soft rounded-xl px-3 py-2">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level Jabatan</label>
            <select value={form.level} onChange={(e) => setForm(v => ({ ...v, level: e.target.value }))} className="w-full border border-soft rounded-xl px-3 py-2">
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={String(form.is_active)} onChange={(e) => setForm(v => ({ ...v, is_active: e.target.value === 'true' }))} className="w-full border border-soft rounded-xl px-3 py-2">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm(v => ({ ...v, description: e.target.value }))} rows={3} className="w-full border border-soft rounded-xl px-3 py-2" />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && <button className="btn btn-secondary" type="button" onClick={reset}>Batal Edit</button>}
          </div>
        </form>
      </FormCard>

      <DataTableCard title="Daftar Global Kata Kerja">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-primaryText">
              <th className="text-left px-3 py-2">Kata Kerja</th>
              <th className="text-left px-3 py-2">Kategori</th>
              <th className="text-left px-3 py-2">Level</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-soft">
                <td className="px-3 py-2 font-medium">{r.word}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2">{r.level}</td>
                <td className="px-3 py-2">{r.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => edit(r)} className="text-brand-600 hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableCard>
    </AppShell>
  )
}
