import { afterEach, describe, expect, it, vi } from 'vitest'
import { getInvestments, openInvestment, simulateInvestment } from '../src/services/api'
import { ApiError } from '../src/services/types'

afterEach(() => vi.restoreAllMocks())

describe('API client', () => {
  it('omits empty filters and trims search text', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ items: [], total: 0 }), { status: 200 }))
    await getInvestments({ status: '', search: '  Ana  ' })
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5206/api/investments?search=Ana', undefined)
  })

  it('maps validation details returned by the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: { message: 'Datos inválidos', details: [{ field: 'amount', message: 'Monto inválido' }] } }), { status: 400 }))
    await expect(simulateInvestment({ productId: 'PF', amount: 0, term: 90, termUnit: 'DAYS' })).rejects.toMatchObject<ApiError>({ status: 400, details: [{ field: 'amount', message: 'Monto inválido' }] })
  })

  it('opens an investment with the personal and simulation data', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 'abc' }), { status: 201 }))
    await openInvestment({ investorName: 'Ana Pérez', investorEmail: 'ana@example.com', productId: 'PF', amount: 1000, term: 90, termUnit: 'DAYS' })
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5206/api/investments', expect.objectContaining({ method: 'POST', body: JSON.stringify({ investorName: 'Ana Pérez', investorEmail: 'ana@example.com', productId: 'PF', amount: 1000, term: 90, termUnit: 'DAYS' }) }))
  })
})
