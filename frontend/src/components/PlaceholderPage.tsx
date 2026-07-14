'use client'

import { useAuth } from '@/lib/auth'
import { Navigation } from '@/components/Navigation'
import LoginPage from '@/app/login/page'

interface PlaceholderPageProps {
  title: string
  unit: string
}

// Navigation がリンクする Unit 1–3 のルート用の共通プレースホルダー。
// 実機能は各 Unit で実装されるまで「◯◯ で実装予定」を表示する。
// 認証状態のガードは HomePage（src/app/page.tsx）と同じ挙動に揃える。
export function PlaceholderPage({ title, unit }: PlaceholderPageProps) {
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600">{title}機能は {unit} で実装されます</p>
        </div>
      </main>
    </>
  )
}
