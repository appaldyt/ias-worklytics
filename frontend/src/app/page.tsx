'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface ApiStatus {
  message: string
  timestamp: string
  version: string
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setLoading(true)
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
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di IAS Worklytics
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sistem Analisis Beban Kerja (ABK) untuk membantu mengoptimalkan 
          produktivitas dan efisiensi kerja di IAS.
        </p>
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

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-2">Analisis Data</h3>
          <p className="text-sm text-gray-600">
            Analisis mendalam terhadap beban kerja dan produktivitas tim.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-900 mb-2">Laporan Real-time</h3>
          <p className="text-sm text-gray-600">
            Dashboard dan laporan yang terupdate secara real-time.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-gray-900 mb-2">Optimasi Performa</h3>
          <p className="text-sm text-gray-600">
            Rekomendasi untuk meningkatkan efisiensi kerja.
          </p>
        </div>
      </div>
    </div>
  )
}