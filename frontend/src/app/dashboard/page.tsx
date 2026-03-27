'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
  id: number
  username: string
  full_name: string
  email: string
  role: string
  tenant: Tenant
}

interface Tenant {
  id: number
  name: string
  code: string
  logo_url?: string
}

interface TenantStats {
  total_employees: number
  total_departments: number
  total_workloads: number
  active_workloads: number
  completed_workloads: number
  pending_workloads: number
}

interface UserStats {
  tenant_stats: TenantStats
  user_role: string
  last_login?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    const storedTenant = localStorage.getItem('tenant')

    if (!token || !storedUser || !storedTenant) {
      router.push('/login')
      return
    }

    // Parse stored data
    setUser(JSON.parse(storedUser))
    setTenant(JSON.parse(storedTenant))

    // Setup axios authorization
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Load dashboard data
    loadDashboardStats()
  }, [router])

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get<UserStats>('/api/auth/dashboard/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    }

    // Clear local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('tenant')
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization']
    
    // Redirect to login
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !tenant || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Data tidak dapat dimuat. Silakan login kembali.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {tenant.name}
              </h1>
              <p className="text-sm text-gray-500">
                Dashboard Analisis Beban Kerja
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user.full_name}
                </div>
                <div className="text-xs text-gray-500">
                  {user.role === 'admin' ? 'Administrator' : 'User'} • {tenant.code}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user.full_name}! 👋
          </h2>
          <p className="text-gray-600">
            Dashboard untuk mengelola dan menganalisis beban kerja di {tenant.name}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.tenant_stats.total_employees}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏢</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Departemen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.tenant_stats.total_departments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📋</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Workload</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.tenant_stats.total_workloads}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏳</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Workload Aktif</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.tenant_stats.active_workloads}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Selesai</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.tenant_stats.completed_workloads}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏸️</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.tenant_stats.pending_workloads}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Kelola Karyawan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Tambah, edit, dan kelola data karyawan di {tenant.name}.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Kelola Karyawan
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-3">🏢</div>
            <h3 className="font-semibold text-gray-900 mb-2">Kelola Departemen</h3>
            <p className="text-sm text-gray-600 mb-4">
              Organisasi departemen dan struktur perusahaan.
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Kelola Departemen
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Analisis ABK</h3>
            <p className="text-sm text-gray-600 mb-4">
              Laporan dan analisis beban kerja mendalam.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              Lihat Analisis
            </button>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informasi Tenant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama Perusahaan</p>
              <p className="font-medium text-gray-900">{tenant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kode</p>
              <p className="font-medium text-gray-900">{tenant.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role Anda</p>
              <p className="font-medium text-gray-900">
                {user.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}