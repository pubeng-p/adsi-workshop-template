'use client'

import { useAuth } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import LoginPage from './login/page'

export default function HomePage() {
  const { employee, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!employee) {
    return <LoginPage />
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
