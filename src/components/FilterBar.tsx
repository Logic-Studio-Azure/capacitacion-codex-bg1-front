import { useState, type SubmitEvent } from 'react'

export interface InvestmentFilters { status: string; search: string }

export function FilterBar({ onApply, onClear, loading }: { onApply: (filters: InvestmentFilters) => void; onClear: () => void; loading: boolean }) {
  const [filters, setFilters] = useState<InvestmentFilters>({ status: '', search: '' })
  const apply = (event: SubmitEvent<HTMLFormElement>) => { event.preventDefault(); onApply({ ...filters, search: filters.search.trim() }) }
  const clear = () => { setFilters({ status: '', search: '' }); onClear() }
  return <form className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-[minmax(180px,0.7fr)_minmax(240px,1.3fr)_auto]" onSubmit={apply}>
    <label className="field-label">Estado<select aria-label="Filtrar por estado" className="field" value={filters.status} onChange={e => setFilters(v => ({ ...v, status: e.target.value }))}><option value="">Todos los estados</option><option value="ABIERTA">Abierta</option><option value="CERRADA">Cerrada</option></select></label>
    <label className="field-label">Buscar inversión<input className="field" aria-label="Buscar por identificador o nombre" placeholder="ID o nombre del inversionista" value={filters.search} onChange={e => setFilters(v => ({ ...v, search: e.target.value }))} /></label>
    <div className="flex items-end gap-2"><button className="primary-button h-11" disabled={loading} type="submit">{loading ? 'Buscando…' : 'Aplicar'}</button><button className="secondary-button h-11" disabled={loading || (!filters.status && !filters.search)} onClick={clear} type="button">Limpiar</button></div>
  </form>
}
