'use client'

import { createContext, useContext, useCallback, useSyncExternalStore, ReactNode } from 'react'
import { apiClient } from './api-client'

interface Employee {
  id: number
  loginId: string
  name: string
  role: 'EMPLOYEE' | 'ADMIN'
}

interface AuthState {
  employee: Employee | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (loginId: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface LoginResponse {
  token: string
  employee: Employee
}

// localStorage を外部ストアとして useSyncExternalStore で購読する。
// これにより effect 内での同期 setState を避けつつ、SSR/ハイドレーション時は
// isLoading=true（サーバーと一致）→ マウント後にクライアント値へ切り替わる、
// という従来挙動（ログイン画面のフラッシュ回避）を維持する。

// サーバー／ハイドレーション時のスナップショット（安定した単一参照）。
const SERVER_SNAPSHOT: AuthState = { employee: null, isLoading: true }

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  window.addEventListener('storage', callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', callback)
  }
}

// スナップショットは参照安定でなければ無限ループになるため、
// localStorage の生文字列が変わったときだけ再計算してキャッシュする。
let cachedRaw: string | null | undefined
let cachedState: AuthState = SERVER_SNAPSHOT

function getSnapshot(): AuthState {
  const raw = localStorage.getItem('employee')
  if (raw !== cachedRaw) {
    cachedRaw = raw
    const token = localStorage.getItem('token')
    const employee = raw && token ? (JSON.parse(raw) as Employee) : null
    cachedState = { employee, isLoading: false }
  }
  return cachedState
}

function getServerSnapshot(): AuthState {
  return SERVER_SNAPSHOT
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { employee, isLoading } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const login = useCallback(async (loginId: string, password: string) => {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginId, password }),
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('employee', JSON.stringify(response.employee))
    emitChange()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('employee')
    emitChange()
  }, [])

  return (
    <AuthContext.Provider value={{ employee, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
