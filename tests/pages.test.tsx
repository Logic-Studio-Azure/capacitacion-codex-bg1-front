import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import * as api from '../src/services/api'

vi.mock('../src/services/api')
const investment = { id: '11111111-1111-1111-1111-111111111111', investorName: 'Ana Pérez', investorEmail: 'ana@example.com', productId: 'PLAZO_FIJO_90', productName: 'Plazo fijo 90 días', amount: 1000, term: 90, termUnit: 'DAYS', annualRate: 0.06, estimatedReturn: 14.79, estimatedFinalAmount: 1014.79, openedAt: '2026-01-15T10:00:00Z', estimatedMaturityDate: '2026-04-15T10:00:00Z', status: 'ABIERTA' as const }
const product = { id: 'PLAZO_FIJO_90', name: 'Plazo fijo 90 días', description: 'Alternativa demostrativa.', annualRate: 0.06, minAmount: 100, maxAmount: 50000, minTerm: 30, maxTerm: 360, allowedTermUnits: ['DAYS'], active: true }

describe('application flows', () => {
  beforeEach(() => { window.history.pushState({}, '', '/'); vi.mocked(api.getInvestments).mockResolvedValue({ items: [investment], total: 1 }); vi.mocked(api.getProducts).mockResolvedValue([product]) })
  it('loads and filters investments', async () => {
    const user = userEvent.setup(); render(<App />)
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Filtrar por estado'), 'ABIERTA')
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))
    await waitFor(() => expect(api.getInvestments).toHaveBeenLastCalledWith({ status: 'ABIERTA', search: '' }))
  })
  it('shows a clear filtered empty state', async () => {
    vi.mocked(api.getInvestments).mockResolvedValue({ items: [], total: 0 }); render(<App />)
    expect(await screen.findByText('Aún no tienes inversiones')).toBeInTheDocument()
  })
  it('validates then submits a simulation once', async () => {
    const user = userEvent.setup(); window.history.pushState({}, '', '/simular'); vi.mocked(api.simulateInvestment).mockResolvedValue({ productId: product.id, amount: 1000, annualRate: .06, term: 90, termUnit: 'DAYS', estimatedReturn: 14.79, estimatedFinalAmount: 1014.79, estimatedMaturityDate: '2026-04-15T10:00:00Z' }); render(<App />)
    await screen.findByText('Plazo fijo 90 días')
    await user.type(screen.getByLabelText('Monto a invertir (USD)'), '1000')
    await user.type(screen.getByLabelText('Plazo'), '90')
    await user.click(screen.getByRole('button', { name: 'Simular inversión' }))
    await waitFor(() => expect(api.simulateInvestment).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Resultado estimado')).toBeInTheDocument()
  })
})
