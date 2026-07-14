'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export function Navigation() {
  const { employee, logout } = useAuth()

  if (!employee) return null

  const isAdmin = employee.role === 'ADMIN'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex gap-4">
        {!isAdmin && (
          <>
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">打刻</Link>
            <Link href="/history" className="text-gray-700 hover:text-blue-600 font-medium">履歴</Link>
            <Link href="/summary" className="text-gray-700 hover:text-blue-600 font-medium">集計</Link>
            <Link href="/leaves" className="text-gray-700 hover:text-blue-600 font-medium">休暇</Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">ダッシュボード</Link>
            <Link href="/admin/attendances" className="text-gray-700 hover:text-blue-600 font-medium">勤怠</Link>
            <Link href="/admin/leaves" className="text-gray-700 hover:text-blue-600 font-medium">休暇承認</Link>
            <Link href="/admin/grant" className="text-gray-700 hover:text-blue-600 font-medium">有給付与</Link>
            <Link href="/admin/export" className="text-gray-700 hover:text-blue-600 font-medium">CSV</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{employee.name}</span>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          ログアウト
        </button>
      </div>
    </nav>
  )
}
