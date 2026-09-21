import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ErrorNotice, LoadingBlock } from '../components/Feedback'
import { date, money, rate, unitLabel } from '../components/InvestmentTable'
import { getProducts, simulateInvestment } from '../services/api'
import { ApiError, type Product, type SimulationResult } from '../services/types'

type Values = { productId: string; amount: string; term: string; termUnit: string }
type Errors = Partial<Record<keyof Values, string>>
const emptyValues: Values = { productId: '', amount: '', term: '', termUnit: '' }

export function SimulatorPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Errors>({})
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const selected = useMemo(() => products.find(p => p.id === values.productId), [products, values.productId])
  const loadProducts = async () => {
    setLoadingProducts(true); setCatalogError(null)
    try {
      const active = (await getProducts()).filter(product => product.active)
      setProducts(active)
      if (active.length) setValues(current => current.productId ? current : { ...current, productId: active[0].id, termUnit: active[0].allowedTermUnits[0] ?? '' })
    } catch (err) { setCatalogError(err instanceof Error ? err.message : 'No pudimos cargar los productos.') } finally { setLoadingProducts(false) }
  }
  useEffect(() => { void loadProducts() }, [])
  const changeProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)
    setValues(current => ({ ...current, productId, termUnit: product?.allowedTermUnits[0] ?? '' }))
    setErrors(current => ({ ...current, productId: undefined, termUnit: undefined })); setResult(null)
  }
  const validate = (): Errors => {
    const next: Errors = {}; const amount = Number(values.amount); const term = Number(values.term)
    if (!selected) next.productId = 'Selecciona un producto disponible.'
    if (!values.amount || !Number.isFinite(amount) || amount <= 0) next.amount = 'Ingresa un monto mayor que cero.'
    else if (selected && (amount < selected.minAmount || amount > selected.maxAmount)) next.amount = `El monto debe estar entre ${money.format(selected.minAmount)} y ${money.format(selected.maxAmount)}.`
    if (!values.term || !Number.isInteger(term) || term <= 0) next.term = 'Ingresa un plazo entero mayor que cero.'
    else if (selected && (term < selected.minTerm || term > selected.maxTerm)) next.term = `El plazo debe estar entre ${selected.minTerm} y ${selected.maxTerm} ${unitLabel(values.termUnit)}.`
    if (!values.termUnit || !selected?.allowedTermUnits.includes(values.termUnit)) next.termUnit = 'Selecciona una unidad permitida para el producto.'
    return next
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault(); const localErrors = validate(); setErrors(localErrors); setResult(null)
    if (Object.keys(localErrors).length) return
    setSubmitting(true)
    try { setResult(await simulateInvestment({ productId: values.productId, amount: Number(values.amount), term: Number(values.term), termUnit: values.termUnit })) }
    catch (err) {
      if (err instanceof ApiError && err.details.length) setErrors(Object.fromEntries(err.details.map(detail => [detail.field as keyof Values, detail.message])))
      else setErrors({ productId: err instanceof Error ? err.message : 'No se pudo realizar la simulación.' })
    } finally { setSubmitting(false) }
  }
  if (loadingProducts) return <div className="page-container py-12"><LoadingBlock label="Cargando productos disponibles…" /></div>
  if (catalogError) return <div className="page-container py-12"><ErrorNotice message={catalogError} onRetry={() => void loadProducts()} /></div>
  return <div className="page-container py-10 sm:py-14">
    <div className="max-w-3xl"><p className="eyebrow">Planifica con claridad</p><h1 className="page-title mt-2">Simula tu inversión</h1><p className="mt-3 text-muted">Conoce una proyección referencial antes de tomar una decisión.</p></div>
    <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8" noValidate onSubmit={submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Producto" error={errors.productId} className="sm:col-span-2"><select className="field" value={values.productId} onChange={e => changeProduct(e.target.value)}>{products.map(product => <option value={product.id} key={product.id}>{product.name}</option>)}</select>{selected && <p className="mt-2 text-xs leading-5 text-muted">{selected.description}</p>}</Field>
          <Field label="Monto a invertir (USD)" error={errors.amount}><input className="field" inputMode="decimal" min={selected?.minAmount} max={selected?.maxAmount} placeholder="Ej. 1000" value={values.amount} onChange={e => { setValues(v => ({ ...v, amount: e.target.value })); setErrors(v => ({ ...v, amount: undefined })) }} /></Field>
          <Field label="Plazo" error={errors.term}><input className="field" inputMode="numeric" min={selected?.minTerm} max={selected?.maxTerm} placeholder="Ej. 90" value={values.term} onChange={e => { setValues(v => ({ ...v, term: e.target.value })); setErrors(v => ({ ...v, term: undefined })) }} /></Field>
          <Field label="Unidad de plazo" error={errors.termUnit} className="sm:col-span-2"><select className="field" value={values.termUnit} onChange={e => setValues(v => ({ ...v, termUnit: e.target.value }))}>{selected?.allowedTermUnits.map(unit => <option key={unit} value={unit}>{unitLabel(unit)}</option>)}</select></Field>
        </div>
        {selected && <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-muted">Monto permitido: {money.format(selected.minAmount)} — {money.format(selected.maxAmount)} · Plazo: {selected.minTerm} — {selected.maxTerm} días · Tasa anual: {rate.format(selected.annualRate)}</p>}
        <button className="primary-button mt-7 w-full sm:w-auto" disabled={submitting || !products.length} type="submit">{submitting ? 'Calculando simulación…' : 'Simular inversión'}</button>
      </form>
      <aside aria-live="polite">{result ? <SimulationResult result={result} /> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7"><h2 className="font-display text-lg font-bold">Tu resultado aparecerá aquí</h2><p className="mt-2 text-sm leading-6 text-muted">Completa los datos para revisar el rendimiento y monto final estimados.</p></div>}</aside>
    </div>
    <p className="mt-7 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950"><span className="font-bold">Importante:</span> esta simulación tiene fines educativos e informativos; los valores son estimados y no constituyen una oferta financiera.</p>
  </div>
}

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: ReactNode; className?: string }) { return <label className={`field-label ${className}`}>{label}{children}{error && <span className="mt-1 text-xs font-semibold text-rose-700" role="alert">{error}</span>}</label> }
function SimulationResult({ result }: { result: SimulationResult }) { return <div className="rounded-2xl bg-ink p-7 text-white"><p className="text-sm text-slate-300">Resultado estimado</p><h2 className="mt-2 font-display text-2xl font-bold">{money.format(result.estimatedFinalAmount)}</h2><dl className="mt-7 divide-y divide-slate-700 text-sm"><Metric label="Monto invertido" value={money.format(result.amount)} /><Metric label="Tasa anual" value={rate.format(result.annualRate)} /><Metric label="Rendimiento estimado" value={money.format(result.estimatedReturn)} /><Metric label="Vencimiento estimado" value={date.format(new Date(result.estimatedMaturityDate))} /></dl></div> }
function Metric({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-300">{label}</dt><dd className="text-right font-semibold">{value}</dd></div> }
