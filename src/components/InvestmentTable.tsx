import type { Investment } from '../services/types'

const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })
const date = new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
const rate = new Intl.NumberFormat('es-EC', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export { money, date, rate }

export function InvestmentTable({ investments }: { investments: Investment[] }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-[1030px] w-full text-left text-sm">
        <caption className="sr-only">Listado de inversiones abiertas</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted">
          <tr>{['Inversión', 'Producto', 'Monto', 'Plazo y tasa', 'Fechas', 'Rendimiento', 'Estado'].map(item => <th className="px-5 py-4 font-semibold" key={item}>{item}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {investments.map(item => <tr className="align-top transition hover:bg-slate-50/70" key={item.id}>
            <td className="px-5 py-5"><p className="font-semibold text-ink">{item.investorName}</p><p className="mt-1 font-mono text-xs text-muted" title={item.id}>{item.id.slice(0, 8)}…</p><p className="mt-1 text-xs text-muted">{item.investorEmail}</p></td>
            <td className="px-5 py-5"><p className="font-semibold">{item.productName}</p><p className="mt-1 text-xs text-muted">{item.productId}</p></td>
            <td className="px-5 py-5 font-semibold">{money.format(item.amount)}</td>
            <td className="px-5 py-5"><p>{item.term} {unitLabel(item.termUnit)}</p><p className="mt-1 text-xs text-muted">Tasa {rate.format(item.annualRate)}</p></td>
            <td className="px-5 py-5 text-xs leading-5 text-muted"><p>Apertura: {date.format(new Date(item.openedAt))}</p><p>Vencimiento: {date.format(new Date(item.estimatedMaturityDate))}</p></td>
            <td className="px-5 py-5"><p className="font-semibold text-emerald-700">+{money.format(item.estimatedReturn)}</p><p className="mt-1 text-xs text-muted">Final: {money.format(item.estimatedFinalAmount)}</p></td>
            <td className="px-5 py-5"><span className={`status-pill ${item.status === 'ABIERTA' ? 'status-open' : 'status-closed'}`}>{item.status}</span></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}

export function unitLabel(unit: string) { return unit === 'DAYS' ? 'días' : unit.toLowerCase() }
