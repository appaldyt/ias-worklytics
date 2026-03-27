'use client'

import { useEffect } from 'react'

export default function SuperAdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Super-admin page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      <div className="max-w-lg w-full panel-card text-center space-y-3">
        <h2 className="text-xl font-semibold text-primaryText">Terjadi error di halaman Super Admin</h2>
        <p className="text-sm text-secondaryText">
          Silakan refresh halaman. Jika masih terjadi, login ulang lalu coba kembali.
        </p>
        <p className="text-xs text-red-600 break-all">{error?.message || 'Unknown client error'}</p>
        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-secondary" onClick={() => window.location.assign('/login')}>Ke Login</button>
          <button className="btn btn-primary" onClick={reset}>Coba Lagi</button>
        </div>
      </div>
    </div>
  )
}
