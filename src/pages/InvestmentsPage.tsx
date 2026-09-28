import { useCallback, useEffect, useState } from 'react'
import { FilterBar, type InvestmentFilters } from '../components/FilterBar'
import { EmptyState, ErrorNotice, LoadingBlock } from '../components/Feedback'
import { InvestmentTable } from '../components/InvestmentTable'
import { getInvestments } from '../services/api'
import type { InvestmentListResponse } from '../services/types'

export function InvestmentsPage() {
  const [data, setData] = useState<InvestmentListResponse | null>(null)
  const [filters, setFilters] = useState<InvestmentFilters>({ status: '', search: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const load = useCallback(async (next = filters) => {
    setLoading(true); setError(null)
    try { setData(await getInvestments(next)) } catch (err) { setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.') } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { void load() }, []) // carga inicial
  const apply = (next: InvestmentFilters) => { setFilters(next); void load(next) }
  const clear = () => { const next = { status: '', search: '' }; setFilters(next); void load(next) }
  const isFiltered = Boolean(filters.status || filters.search)
  
  return <div className="page-container py-10 sm:py-14">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Cartera de demostración</p><h1 className="page-title mt-2">Tus inversiones</h1><p className="mt-3 max-w-2xl text-muted">Consulta el estado y la proyección estimada de cada inversión.</p></div><button className="secondary-button" disabled={loading} onClick={() => void load()}>↻ Recargar</button></div>
    <FilterBar loading={loading} onApply={apply} onClear={clear} />
    <div className="mt-7">{loading && !data ? <LoadingBlock /> : error ? <ErrorNotice message={error} onRetry={() => void load()} /> : !data?.items.length ? <EmptyState filtered={isFiltered} /> : <><p className="mb-3 text-sm text-muted" aria-live="polite">{data.total} {data.total === 1 ? 'inversión encontrada' : 'inversiones encontradas'}</p><InvestmentTable investments={data.items} /></>}</div>
  </div>
}
