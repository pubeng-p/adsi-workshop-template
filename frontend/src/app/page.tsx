'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'

export default function HomePage() {
  const { employee, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !employee) {
      router.push('/login')
    }
  }, [employee, isLoading, router])

  if (isLoading || !employee) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>
  }

  if (employee.role === 'ADMIN') {
    router.push('/admin')
    return null
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">打刻</h1>
          <p className="text-gray-600">打刻機能は Unit 1 で実装されます</p>
        </div>
      </main>
    </>
  )
}
