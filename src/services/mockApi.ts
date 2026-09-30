import { ApiError, type Investment, type InvestmentListResponse, type InvestmentOpeningRequest, type Product, type SimulationRequest, type SimulationResult } from './types'

const products: Product[] = [
  { id: 'AHORRO_FLEXIBLE', name: 'Ahorro flexible', description: 'Ahorro con plazo flexible', annualRate: 0.03, minAmount: 100, maxAmount: 10000, minTerm: 30, maxTerm: 730, allowedTermUnits: ['DAYS'], active: true },
  { id: 'PLAZO_FIJO_180', name: 'Plazo fijo 180 días', description: 'Inversión a plazo fijo de 180 días', annualRate: 0.065, minAmount: 500, maxAmount: 50000, minTerm: 180, maxTerm: 180, allowedTermUnits: ['DAYS'], active: true },
  { id: 'PLAZO_FIJO_90', name: 'Plazo fijo 90 días', description: 'Inversión a plazo fijo de 90 días', annualRate: 0.06, minAmount: 500, maxAmount: 50000, minTerm: 90, maxTerm: 90, allowedTermUnits: ['DAYS'], active: true },
]
const investments: Investment[] = []

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

function project(payload: SimulationRequest, openedAt: Date): SimulationResult {
  const product = products.find(item => item.id === payload.productId && item.active)
  if (!product) throw new ApiError('Datos inválidos', 400, [{ field: 'productId', message: 'Selecciona un producto disponible.' }])

  const details = []
  if (!Number.isFinite(payload.amount) || payload.amount < product.minAmount || payload.amount > product.maxAmount) {
    details.push({ field: 'amount', message: `El monto debe estar entre ${product.minAmount} y ${product.maxAmount}.` })
  }
  if (!Number.isInteger(payload.term) || payload.term < product.minTerm || payload.term > product.maxTerm) {
    details.push({ field: 'term', message: `El plazo debe estar entre ${product.minTerm} y ${product.maxTerm} días.` })
  }
  if (!product.allowedTermUnits.includes(payload.termUnit)) {
    details.push({ field: 'termUnit', message: 'Selecciona una unidad permitida para el producto.' })
  }
  if (details.length) throw new ApiError('Datos inválidos', 400, details)

  const estimatedReturn = round2(payload.amount * product.annualRate * payload.term / 365)
  return {
    ...payload,
    annualRate: product.annualRate,
    estimatedReturn,
    estimatedFinalAmount: round2(payload.amount + estimatedReturn),
    estimatedMaturityDate: new Date(openedAt.getTime() + payload.term * 86400000).toISOString(),
  }
}

export async function getMockProducts(): Promise<Product[]> {
  return products.map(product => ({ ...product, allowedTermUnits: [...product.allowedTermUnits] }))
}

export async function getMockInvestments(filters: { status?: string; search?: string } = {}): Promise<InvestmentListResponse> {
  const search = filters.search?.trim().toLocaleLowerCase()
  const items = investments.filter(investment =>
    (!filters.status || investment.status === filters.status) &&
    (!search || [investment.investorName, investment.investorEmail, investment.productName].some(value => value.toLocaleLowerCase().includes(search))),
  )
  return { items: items.map(investment => ({ ...investment })), total: items.length }
}

export async function simulateMockInvestment(payload: SimulationRequest): Promise<SimulationResult> {
  return project(payload, new Date())
}

export async function openMockInvestment(payload: InvestmentOpeningRequest): Promise<Investment> {
  const details = []
  if (!payload.investorName?.trim()) details.push({ field: 'investorName', message: 'Ingresa el nombre del inversionista.' })
  if (!/^\S+@\S+\.\S+$/.test(payload.investorEmail?.trim() ?? '')) details.push({ field: 'investorEmail', message: 'Ingresa un correo electrónico válido.' })
  if (details.length) throw new ApiError('Datos inválidos', 400, details)

  const openedAt = new Date()
  const projection = project(payload, openedAt)
  const investment: Investment = {
    ...projection,
    id: crypto.randomUUID(),
    investorName: payload.investorName.trim(),
    investorEmail: payload.investorEmail.trim(),
    productName: products.find(product => product.id === payload.productId)!.name,
    openedAt: openedAt.toISOString(),
    status: 'ABIERTA',
  }
  investments.unshift(investment)
  return { ...investment }
}