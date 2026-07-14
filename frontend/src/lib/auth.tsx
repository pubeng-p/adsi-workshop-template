'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { apiClient } from './api-client'

interface Employee {
  id: number
  loginId: string
  name: string
  role: 'EMPLOYEE' | 'ADMIN'
}

interface AuthContextType {
  employee: Employee | null
  isLoading: boolean
  login: (loginId: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface LoginResponse {
  token: string
  employee: Employee
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('employee')
    if (token && stored) {
      setEmployee(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (loginId: string, password: string) => {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginId, password }),
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('employee', JSON.stringify(response.employee))
    setEmployee(response.employee)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('employee')
    setEmployee(null)
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
