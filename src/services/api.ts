import { ApiError, type Investment, type InvestmentListResponse, type InvestmentOpeningRequest, type Product, type SimulationRequest, type SimulationResult } from './types'

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5206').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, init)
  } catch {
    throw new ApiError('No pudimos conectarnos con el servicio. Verifica tu conexión e inténtalo nuevamente.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const error = body?.error
    throw new ApiError(
      error?.message ?? 'Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.',
      response.status,
      error?.details ?? [],
    )
  }
  return response.json() as Promise<T>
}

export function getInvestments(filters: { status?: string; search?: string } = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.search?.trim()) params.set('search', filters.search.trim())
  const query = params.toString()
  return request<InvestmentListResponse>(`/api/investments${query ? `?${query}` : ''}`)
}

export function getProducts() { return request<Product[]>('/api/products') }

export function simulateInvestment(payload: SimulationRequest) {
  return request<SimulationResult>('/api/investments/simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function openInvestment(payload: InvestmentOpeningRequest) {
  return request<Investment>('/api/investments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
