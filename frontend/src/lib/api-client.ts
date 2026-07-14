const SAGEMAKER_BASE_PATH = '/codeeditor/default/absports/3000'

export function withBasePath(path: string): string {
  if (process.env.NEXT_PUBLIC_SAGEMAKER === '1') {
    return `${SAGEMAKER_BASE_PATH}${path}`
  }
  return path
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = withBasePath(`/api${path}`)
  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'エラーが発生しました' }))
    throw new ApiError(response.status, body.message || 'エラーが発生しました')
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
