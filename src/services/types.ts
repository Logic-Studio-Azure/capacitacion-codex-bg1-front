export type InvestmentStatus = 'ABIERTA' | 'CERRADA'

export interface Investment {
  id: string
  investorName: string
  investorEmail: string
  productId: string
  productName: string
  amount: number
  term: number
  termUnit: string
  annualRate: number
  estimatedReturn: number
  estimatedFinalAmount: number
  openedAt: string
  estimatedMaturityDate: string
  status: InvestmentStatus
}

export interface InvestmentListResponse { items: Investment[]; total: number }

export interface Product {
  id: string
  name: string
  description: string
  annualRate: number
  minAmount: number
  maxAmount: number
  minTerm: number
  maxTerm: number
  allowedTermUnits: string[]
  active: boolean
}

export interface SimulationRequest {
  productId: string
  amount: number
  term: number
  termUnit: string
}

export interface SimulationResult extends SimulationRequest {
  annualRate: number
  estimatedReturn: number
  estimatedFinalAmount: number
  estimatedMaturityDate: string
}

export interface InvestmentOpeningRequest extends SimulationRequest {
  investorName: string
  investorEmail: string
}

export interface ApiFieldError { field: string; message: string }

export class ApiError extends Error {
  constructor(message: string, readonly status?: number, readonly details: ApiFieldError[] = []) {
    super(message)
    this.name = 'ApiError'
  }
}
