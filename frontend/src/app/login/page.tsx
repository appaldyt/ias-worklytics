'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Tenant {
  id: number
  name: string
  code: string
  logo_url?: string
  is_active: boolean
}

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: {
    id: number
    username: string
    full_name: string
    email: string
    role: string
    tenant: Tenant
  }
  tenant: Tenant
}

export default function LoginPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load available tenants
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const response = await axios.get<Tenant[]>('/api/auth/tenants')
        setTenants(response.data)
      } catch (err) {
        console.error('Failed to load tenants:', err)
        // Fallback to hardcoded tenants if API fails
        const fallbackTenants: Tenant[] = [
          { id: 1, name: "PT Integrasi Aviasi Solusi (IAS)", code: "IAS", is_active: true },
          { id: 2, name: "PT Gapura Angkasa", code: "GAPURA", is_active: true },
          { id: 3, name: "PT IAS Support (IASS)", code: "IASS", is_active: true },
          { id: 4, name: "PT IAS Hospitality (IASH)", code: "IASH", is_active: true },
          { id: 5, name: "PT IAS Property (IASP)", code: "IASP", is_active: true },
          { id: 6, name: "PT Angkasa Pura Support (APS1)", code: "APS1", is_active: true }
        ]
        setTenants(fallbackTenants)
        setError('Menggunakan mode fallback - API tidak tersedia')
      }
    }

    loadTenants()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTenant || !username || !password) {
      setError('Semua field harus diisi')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post<LoginResponse>('/api/auth/login', {
        username,
        password,
        tenant_code: selectedTenant
      })

      // Store authentication data
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('tenant', JSON.stringify(response.data.tenant))

      // Setup axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`

      // Redirect to dashboard
      router.push('/dashboard')

    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Login gagal. Periksa kredensial Anda.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            IAS Worklytics
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistem Analisis Beban Kerja Multi-Tenant
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Tenant Selection */}
            <div>
              <label htmlFor="tenant" className="block text-sm font-medium text-gray-700">
                Perusahaan
              </label>
              <select
                id="tenant"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Perusahaan</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.code}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Demo Credentials (Development):
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>IAS:</strong> admin_ias / admin123</div>
              <div><strong>GAPURA:</strong> admin_gapura / admin123</div>
              <div><strong>IASS:</strong> admin_iass / admin123</div>
              <div><strong>IASH:</strong> admin_iash / admin123</div>
              <div><strong>IASP:</strong> admin_iasp / admin123</div>
              <div><strong>APS1:</strong> admin_aps1 / admin123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}