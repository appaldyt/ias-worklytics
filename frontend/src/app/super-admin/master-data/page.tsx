'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AppShell from '@/components/AppShell'
import SectionHeader from '@/components/ui/SectionHeader'
import StatCard from '@/components/ui/StatCard'
import FormCard from '@/components/ui/FormCard'
import DataTableCard from '@/components/ui/DataTableCard'

type Tenant = {
  id: number
  name: string
  code: string
  subdomain?: string
  logo_url?: string
  description?: string
  is_active: boolean
}

const emptyForm = {
  name: '',
  code: '',
  subdomain: '',
  description: '',
  is_active: true,
}

export default function SuperAdminMasterDataPage() {
  const [userName, setUserName] = useState('Super Admin')
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')

    if (user) {
      try {
        const parsed = JSON.parse(user)
        setUserName(parsed.full_name || 'Super Admin')
      } catch {}
    }

    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      setLoading(true)
      const res = await axios.get<Tenant[]>('/api/admin/tenants')
      setTenants(res.data)
      setError(null)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal memuat tenant')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditId(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = {
        name: form.name,
        code: form.code.toUpperCase(),
        subdomain: form.subdomain || undefined,
        description: form.description || undefined,
        is_active: form.is_active,
      }

      if (editId) {
        await axios.put(`/api/admin/tenants/${editId}`, payload)
        setSuccess('Tenant berhasil diperbarui')
      } else {
        await axios.post('/api/admin/tenants', payload)
        setSuccess('Tenant berhasil dibuat')
      }

      resetForm()
      await loadTenants()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menyimpan tenant')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = async (id: number) => {
    try {
      const res = await axios.get<Tenant>(`/api/admin/tenants/${id}`)
      const t = res.data
      setEditId(t.id)
      setForm({
        name: t.name,
        code: t.code,
        subdomain: t.subdomain || '',
        description: t.description || '',
        is_active: t.is_active,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal mengambil data tenant')
    }
  }

  const onDelete = async (id: number) => {
    const ok = confirm('Nonaktifkan tenant ini?')
    if (!ok) return
    try {
      await axios.delete(`/api/admin/tenants/${id}`)
      setSuccess('Tenant berhasil dinonaktifkan')
      await loadTenants()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menonaktifkan tenant')
    }
  }

  return (
    <AppShell
      role="super_admin"
      title="Super Admin — Tenant Management"
      subtitle={`Selamat datang, ${userName}. Kelola tenant IAS Group.`}
    >
      <SectionHeader
        title="Tenant Management"
        subtitle="CRUD tenant + pengaturan status active/inactive"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Tenant" value={tenants.length} />
        <StatCard label="Tenant Aktif" value={tenants.filter((t) => t.is_active).length} tone="success" />
        <StatCard label="Mode" value="CRUD" tone="brand" />
        <StatCard label="Status" value="Ready" tone="success" />
      </div>

      <FormCard title={editId ? 'Edit Tenant' : 'Buat Tenant Baru'}>
        {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Nama Tenant</label>
            <input
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              required
              className="w-full border border-soft rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Kode</label>
            <input
              value={form.code}
              onChange={(e) => setForm((v) => ({ ...v, code: e.target.value }))}
              required
              className="w-full border border-soft rounded-xl px-3 py-2 uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Subdomain</label>
            <input
              value={form.subdomain}
              onChange={(e) => setForm((v) => ({ ...v, subdomain: e.target.value }))}
              className="w-full border border-soft rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Status</label>
            <select
              value={String(form.is_active)}
              onChange={(e) => setForm((v) => ({ ...v, is_active: e.target.value === 'true' }))}
              className="w-full border border-soft rounded-xl px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primaryText mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
              rows={3}
              className="w-full border border-soft rounded-xl px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button disabled={saving} className="btn btn-primary" type="submit">
              {saving ? 'Menyimpan...' : editId ? 'Update Tenant' : 'Create Tenant'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </FormCard>

      <DataTableCard title="Daftar Tenant">
        {loading ? (
          <p className="muted">Memuat data tenant...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-brand-soft text-primaryText">
                <th className="text-left px-3 py-2">Nama</th>
                <th className="text-left px-3 py-2">Kode</th>
                <th className="text-left px-3 py-2">Subdomain</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-soft">
                  <td className="px-3 py-2">{t.name}</td>
                  <td className="px-3 py-2 font-medium">{t.code}</td>
                  <td className="px-3 py-2">{t.subdomain || '-'}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    <button onClick={() => onEdit(t.id)} className="text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline">Nonaktifkan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTableCard>
    </AppShell>
  )
}
