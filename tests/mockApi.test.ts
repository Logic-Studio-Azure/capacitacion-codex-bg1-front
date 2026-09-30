import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as Api from '../src/services/api'

const request = { productId: 'PLAZO_FIJO_90', amount: 1000, term: 90, termUnit: 'DAYS' }
let api: typeof Api

beforeEach(async () => {
  vi.resetModules()
  vi.stubEnv('VITE_USE_BACKEND', '0')
  api = await import('../src/services/api')
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('local investment services', () => {
  it('uses the sample catalog without any network request by default', async () => {
    vi.stubEnv('VITE_USE_BACKEND', undefined)
    vi.resetModules()
    api = await import('../src/services/api')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const products = await api.getProducts()
    expect(products.map(product => product.id)).toEqual(['AHORRO_FLEXIBLE', 'PLAZO_FIJO_180', 'PLAZO_FIJO_90'])
    expect(products[2]).toMatchObject({ annualRate: 0.06, minTerm: 90, maxTerm: 90, allowedTermUnits: ['DAYS'] })
    expect(await api.getInvestments()).toEqual({ items: [], total: 0 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shares the projected return and maturity between simulation and opening', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'))
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const simulation = await api.simulateInvestment(request)
    expect(simulation).toMatchObject({ annualRate: 0.06, estimatedReturn: 14.79, estimatedFinalAmount: 1014.79, estimatedMaturityDate: '2026-04-15T10:00:00.000Z' })
    const opened = await api.openInvestment({ ...request, investorName: 'Ana Pérez', investorEmail: 'ana@example.com' })
    expect(opened).toMatchObject({ ...simulation, productName: 'Plazo fijo 90 días', investorName: 'Ana Pérez', openedAt: '2026-01-15T10:00:00.000Z', status: 'ABIERTA' })
    expect(opened.id).toBeTruthy()
    expect((await api.getInvestments()).items).toEqual([opened])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('filters and orders opened investments and discards them on reload', async () => {
    await api.openInvestment({ ...request, investorName: 'Ana Pérez', investorEmail: 'ana@example.com' })
    const second = await api.openInvestment({ ...request, investorName: 'Luis', investorEmail: 'luis@example.com' })
    expect((await api.getInvestments()).items[0]).toEqual(second)
    expect((await api.getInvestments({ status: 'ABIERTA', search: '  ANA  ' })).total).toBe(1)
    expect((await api.getInvestments({ status: 'CERRADA' })).total).toBe(0)
    expect((await api.getInvestments({ search: 'plazo fijo' })).total).toBe(2)
    vi.resetModules()
    const reloaded = await import('../src/services/api')
    expect(await reloaded.getInvestments()).toEqual({ items: [], total: 0 })
  })

  it('rejects invalid product terms and investor data with field errors', async () => {
    await expect(api.simulateInvestment({ ...request, productId: 'UNKNOWN' })).rejects.toMatchObject({ name: 'ApiError', message: 'Datos inválidos', status: 400, details: [{ field: 'productId', message: expect.any(String) }] })
    await expect(api.simulateInvestment({ ...request, amount: 100, term: 30, termUnit: 'MONTHS' })).rejects.toMatchObject({ name: 'ApiError', message: 'Datos inválidos', status: 400, details: expect.arrayContaining([{ field: 'amount', message: expect.any(String) }, { field: 'term', message: expect.any(String) }, { field: 'termUnit', message: expect.any(String) }]) })
    await expect(api.openInvestment({ ...request, investorName: '', investorEmail: 'invalid' })).rejects.toMatchObject({ name: 'ApiError', message: 'Datos inválidos', status: 400, details: expect.arrayContaining([{ field: 'investorName', message: expect.any(String) }, { field: 'investorEmail', message: expect.any(String) }]) })
    expect((await api.getInvestments()).total).toBe(0)
  })
})