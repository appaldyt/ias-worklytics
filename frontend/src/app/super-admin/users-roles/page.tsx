'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AppShell from '@/components/AppShell'
import SectionHeader from '@/components/ui/SectionHeader'
import FormCard from '@/components/ui/FormCard'
import DataTableCard from '@/components/ui/DataTableCard'

type TenantOpt = { id: number; name: string; code: string }
type UserRow = {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  tenant_id: number
  tenant_access_ids: number[]
  is_active: boolean
}

const emptyForm = {
  username: '',
  email: '',
  full_name: '',
  password: '',
  role: 'karyawan',
  default_tenant_id: 0,
  tenant_access_ids: [] as number[],
}

export default function SuperAdminUsersRolesPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [tenants, setTenants] = useState<TenantOpt[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [u, t] = await Promise.all([
        axios.get<UserRow[]>('/api/admin/users'),
        axios.get<TenantOpt[]>('/api/admin/tenants/options'),
      ])
      const safeUsers = Array.isArray(u.data) ? u.data : []
      const safeTenants = Array.isArray(t.data) ? t.data : []
      setUsers(safeUsers)
      setTenants(safeTenants)
      if (!editId && safeTenants.length && form.default_tenant_id === 0) {
        setForm((v) => ({ ...v, default_tenant_id: safeTenants[0].id }))
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal memuat data user/role')
    }
  }

  const toggleAccess = (tenantId: number) => {
    setForm((v) => {
      const set = new Set(v.tenant_access_ids)
      if (set.has(tenantId)) set.delete(tenantId)
      else set.add(tenantId)
      return { ...v, tenant_access_ids: Array.from(set) }
    })
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ ...emptyForm, default_tenant_id: tenants[0]?.id || 0 })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const payload: any = {
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        default_tenant_id: form.default_tenant_id,
        tenant_access_ids: Array.from(new Set([...form.tenant_access_ids, form.default_tenant_id])),
      }

      if (editId) {
        await axios.put(`/api/admin/users/${editId}`, payload)
        setSuccess('User berhasil diperbarui')
      } else {
        await axios.post('/api/admin/users', {
          ...payload,
          username: form.username,
          password: form.password,
        })
        setSuccess('User berhasil dibuat')
      }

      resetForm()
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menyimpan user')
    }
  }

  const startEdit = (u: UserRow) => {
    setEditId(u.id)
    setForm({
      username: u.username,
      email: u.email,
      full_name: u.full_name,
      password: '',
      role: u.role,
      default_tenant_id: u.tenant_id,
      tenant_access_ids: u.tenant_access_ids || [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deactivate = async (id: number) => {
    if (!confirm('Nonaktifkan user ini?')) return
    try {
      await axios.delete(`/api/admin/users/${id}`)
      setSuccess('User dinonaktifkan')
      await loadAll()
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Gagal menonaktifkan user')
    }
  }

  return (
    <AppShell role="super_admin" title="Super Admin — User & Role" subtitle="CRUD user, role, dan akses tenant">
      <SectionHeader title="User & Role Management" subtitle="Super Admin dapat mengatur akses tenant untuk setiap user." />

      <FormCard title={editId ? 'Edit User' : 'Create User'}>
        {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input disabled={!!editId} value={form.username} onChange={(e) => setForm((v) => ({ ...v, username: e.target.value }))} required className="w-full border border-soft rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} required className="w-full border border-soft rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input value={form.full_name} onChange={(e) => setForm((v) => ({ ...v, full_name: e.target.value }))} required className="w-full border border-soft rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm((v) => ({ ...v, role: e.target.value }))} className="w-full border border-soft rounded-xl px-3 py-2">
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="karyawan">Karyawan</option>
            </select>
          </div>

          {!editId && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} required className="w-full border border-soft rounded-xl px-3 py-2" />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Default Tenant</label>
            <select value={form.default_tenant_id} onChange={(e) => setForm((v) => ({ ...v, default_tenant_id: Number(e.target.value) }))} className="w-full border border-soft rounded-xl px-3 py-2">
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Akses Tenant</label>
            <div className="grid md:grid-cols-2 gap-2">
              {tenants.map((t) => {
                const checked = form.tenant_access_ids.includes(t.id) || form.default_tenant_id === t.id
                return (
                  <label key={t.id} className="flex items-center gap-2 border border-soft rounded-lg px-3 py-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAccess(t.id)}
                      disabled={form.default_tenant_id === t.id}
                    />
                    <span className="text-sm">{t.name} ({t.code})</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary" type="submit">{editId ? 'Update User' : 'Create User'}</button>
            {editId && <button className="btn btn-secondary" type="button" onClick={resetForm}>Batal Edit</button>}
          </div>
        </form>
      </FormCard>

      <DataTableCard title="Daftar User">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-brand-soft text-primaryText">
              <th className="text-left px-3 py-2">Username</th>
              <th className="text-left px-3 py-2">Nama</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Tenant Akses</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-soft">
                <td className="px-3 py-2 font-medium">{u.username}</td>
                <td className="px-3 py-2">{u.full_name}</td>
                <td className="px-3 py-2 uppercase text-xs">{u.role}</td>
                <td className="px-3 py-2">{u.tenant_access_ids?.length || 0}</td>
                <td className="px-3 py-2">{u.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => startEdit(u)} className="text-brand-600 hover:underline">Edit</button>
                  <button onClick={() => deactivate(u.id)} className="text-red-600 hover:underline">Nonaktifkan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableCard>
    </AppShell>
  )
}
