'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface ApiStatus {
  message: string
  timestamp: string
  version: string
  features?: string[]
  endpoints?: any
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('access_token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard')
      return
    }

    const checkApiStatus = async () => {
      try {
        setLoading(true)
        // API accessible from same domain via nginx routing
        const response = await axios.get<ApiStatus>('/api/health')
        setApiStatus(response.data)
        setError(null)
      } catch (err) {
        setError('Tidak dapat terhubung ke API backend')
        setApiStatus(null)
      } finally {
        setLoading(false)
      }
    }

    checkApiStatus()
  }, [router])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di IAS Worklytics
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Sistem Analisis Beban Kerja (ABK) Multi-Tenant untuk 6 perusahaan 
          IAS Group. Kelola dan analisis produktivitas dengan mudah.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Masuk ke Sistem
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>

      {/* API Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Status Koneksi API
        </h2>
        
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Memeriksa koneksi...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Koneksi Gagal
                </h3>
                <div className="text-sm text-red-700 mt-2">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {apiStatus && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="text-green-400">✅</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  API Terhubung
                </h3>
                <div className="text-sm text-green-700 mt-2">
                  <p><strong>Message:</strong> {apiStatus.message}</p>
                  <p><strong>Version:</strong> {apiStatus.version}</p>
                  <p><strong>Time:</strong> {new Date(apiStatus.timestamp).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* IAS Group Companies */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Perusahaan IAS Group yang Didukung
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT Integrasi Aviasi Solusi (IAS)</div>
            <div className="text-sm text-gray-600">Parent Company</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT Gapura Angkasa</div>
            <div className="text-sm text-gray-600">Ground Handling Services</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT IAS Support (IASS)</div>
            <div className="text-sm text-gray-600">Aviation Support Services</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT IAS Hospitality (IASH)</div>
            <div className="text-sm text-gray-600">Airport Hospitality</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT IAS Property (IASP)</div>
            <div className="text-sm text-gray-600">Property Development</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900">PT Angkasa Pura Support (APS1)</div>
            <div className="text-sm text-gray-600">Airport Operations</div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">🏢</div>
          <h3 className="font-semibold text-gray-900 mb-2">Multi-Tenant</h3>
          <p className="text-sm text-gray-600">
            Setiap perusahaan memiliki data terpisah dan aman dengan sistem tenant.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-2">Analisis ABK</h3>
          <p className="text-sm text-gray-600">
            Analisis mendalam terhadap beban kerja dan produktivitas karyawan.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="font-semibold text-gray-900 mb-2">Keamanan Tinggi</h3>
          <p className="text-sm text-gray-600">
            Sistem authentication dan authorization dengan role-based access.
          </p>
        </div>
      </div>
    </div>
  )
}