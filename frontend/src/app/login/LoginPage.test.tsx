import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from './page'

const mockPush = vi.fn()
const mockLogin = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    employee: null,
    isLoading: false,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ログインフォームが表示される', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText('ログインID')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
  })

  it('送信時にlogin関数が呼ばれる', async () => {
    mockLogin.mockResolvedValue(undefined)
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('ログインID'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123')
    })
  })

  it('エラー時にメッセージが表示される', async () => {
    const { ApiError } = await import('@/lib/api-client')
    mockLogin.mockRejectedValue(new ApiError(401, 'ユーザー名またはパスワードが正しくありません'))
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('ログインID'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('ユーザー名またはパスワードが正しくありません')
    })
  })
})
