import { useEffect, useMemo, useState, type ReactNode, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { ErrorNotice, LoadingBlock } from '../components/Feedback'
import { date, money, rate, unitLabel } from '../components/InvestmentTable'
import { getProducts, openInvestment } from '../services/api'
import { ApiError, type Investment, type Product } from '../services/types'

type Values = { productId: string; investorName: string; investorEmail: string; amount: string; term: string; termUnit: string }
type Errors = Partial<Record<keyof Values, string>>
const initialValues: Values = { productId: '', investorName: '', investorEmail: '', amount: '', term: '', termUnit: '' }

export function OpeningPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [opened, setOpened] = useState<Investment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selected = useMemo(() => products.find(product => product.id === values.productId), [products, values.productId])

  const loadProducts = async () => {
    setLoading(true); setError(null)
    try {
      const active = (await getProducts()).filter(product => product.active)
      setProducts(active)
      if (active.length) setValues(current => current.productId ? current : { ...current, productId: active[0].id, termUnit: active[0].allowedTermUnits[0] ?? '' })
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar los productos.') } finally { setLoading(false) }
  }
  useEffect(() => { void loadProducts() }, [])

  const changeProduct = (productId: string) => {
    const product = products.find(item => item.id === productId)
    setValues(current => ({ ...current, productId, termUnit: product?.allowedTermUnits[0] ?? '' }))
    setErrors(current => ({ ...current, productId: undefined, termUnit: undefined, amount: undefined, term: undefined }))
  }
  const validate = (): Errors => {
    const next: Errors = {}; const amount = Number(values.amount); const term = Number(values.term)
    if (!values.investorName.trim()) next.investorName = 'Ingresa el nombre del inversionista.'
    if (!values.investorEmail.trim()) next.investorEmail = 'Ingresa un correo electrónico.'
    else if (!/^\S+@\S+\.\S+$/.test(values.investorEmail)) next.investorEmail = 'Ingresa un correo electrónico válido.'
    if (!selected) next.productId = 'Selecciona un producto disponible.'
    if (!values.amount || !Number.isFinite(amount) || amount <= 0) next.amount = 'Ingresa un monto mayor que cero.'
    else if (selected && (amount < selected.minAmount || amount > selected.maxAmount)) next.amount = `El monto debe estar entre ${money.format(selected.minAmount)} y ${money.format(selected.maxAmount)}.`
    if (!values.term || !Number.isInteger(term) || term <= 0) next.term = 'Ingresa un plazo entero mayor que cero.'
    else if (selected && (term < selected.minTerm || term > selected.maxTerm)) next.term = `El plazo debe estar entre ${selected.minTerm} y ${selected.maxTerm} ${unitLabel(values.termUnit)}.`
    if (!values.termUnit || !selected?.allowedTermUnits.includes(values.termUnit)) next.termUnit = 'Selecciona una unidad permitida para el producto.'
    return next
  }
  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault(); const localErrors = validate(); setErrors(localErrors); setOpened(null)
    if (Object.keys(localErrors).length) return
    setSubmitting(true)
    try { setOpened(await openInvestment({ investorName: values.investorName.trim(), investorEmail: values.investorEmail.trim(), productId: values.productId, amount: Number(values.amount), term: Number(values.term), termUnit: values.termUnit })) }
    catch (err) { setErrors(err instanceof ApiError && err.details.length ? Object.fromEntries(err.details.map(detail => [detail.field as keyof Values, detail.message])) : { investorEmail: err instanceof Error ? err.message : 'No se pudo abrir la inversión.' }) }
    finally { setSubmitting(false) }
  }
  if (loading) return <div className="page-container py-12"><LoadingBlock label="Cargando productos disponibles…" /></div>
  if (error) return <div className="page-container py-12"><ErrorNotice message={error} onRetry={() => void loadProducts()} /></div>
  if (opened) return <div className="page-container py-10 sm:py-14"><div className="mx-auto max-w-2xl rounded-2xl bg-ink p-8 text-white shadow-sm sm:p-10"><p className="eyebrow text-pink-200">¡Listo!</p><h1 className="mt-2 font-display text-3xl font-bold">Inversión abierta</h1><p className="mt-3 text-slate-300">La inversión de demostración fue registrada correctamente.</p><dl className="mt-7 divide-y divide-slate-700 text-sm"><Metric label="Inversionista" value={opened.investorName} /><Metric label="Producto" value={opened.productName} /><Metric label="Monto final estimado" value={money.format(opened.estimatedFinalAmount)} /><Metric label="Vencimiento" value={date.format(new Date(opened.estimatedMaturityDate))} /></dl><div className="mt-7 flex flex-wrap gap-3"><Link className="primary-button bg-white text-magenta hover:bg-pink-50" to="/">Ver mis inversiones</Link><Link className="secondary-button border-slate-500 bg-transparent text-white hover:border-white hover:text-white" to="/apertura">Abrir otra inversión</Link></div></div></div>
  return <div className="page-container py-10 sm:py-14"><div className="max-w-3xl"><p className="eyebrow">Da el siguiente paso</p><h1 className="page-title mt-2">Apertura de inversión</h1><p className="mt-3 text-muted">Registra una inversión de demostración directamente, sin pasar por el simulador.</p></div><form className="mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8" noValidate onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><Field label="Nombre completo" error={errors.investorName}><input className="field" value={values.investorName} onChange={e => { setValues(v => ({ ...v, investorName: e.target.value })); setErrors(v => ({ ...v, investorName: undefined })) }} /></Field><Field label="Correo electrónico" error={errors.investorEmail}><input className="field" type="email" value={values.investorEmail} onChange={e => { setValues(v => ({ ...v, investorEmail: e.target.value })); setErrors(v => ({ ...v, investorEmail: undefined })) }} /></Field><Field label="Producto" error={errors.productId} className="sm:col-span-2"><select className="field" value={values.productId} onChange={e => changeProduct(e.target.value)}>{products.map(product => <option value={product.id} key={product.id}>{product.name}</option>)}</select>{selected && <p className="mt-2 text-xs leading-5 text-muted">{selected.description}</p>}</Field><Field label="Monto a invertir (USD)" error={errors.amount}><input className="field" inputMode="decimal" placeholder="Ej. 1000" value={values.amount} onChange={e => { setValues(v => ({ ...v, amount: e.target.value })); setErrors(v => ({ ...v, amount: undefined })) }} /></Field><Field label="Plazo" error={errors.term}><input className="field" inputMode="numeric" placeholder="Ej. 90" value={values.term} onChange={e => { setValues(v => ({ ...v, term: e.target.value })); setErrors(v => ({ ...v, term: undefined })) }} /></Field><Field label="Unidad de plazo" error={errors.termUnit} className="sm:col-span-2"><select className="field" value={values.termUnit} onChange={e => { setValues(v => ({ ...v, termUnit: e.target.value })); setErrors(v => ({ ...v, termUnit: undefined })) }}>{selected?.allowedTermUnits.map(unit => <option key={unit} value={unit}>{unitLabel(unit)}</option>)}</select></Field></div>{selected && <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-muted">Monto permitido: {money.format(selected.minAmount)} — {money.format(selected.maxAmount)} · Plazo: {selected.minTerm} — {selected.maxTerm} días · Tasa anual: {rate.format(selected.annualRate)}</p>}<button className="primary-button mt-7" disabled={submitting || !products.length} type="submit">{submitting ? 'Abriendo inversión…' : 'Confirmar apertura'}</button></form><p className="mt-7 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950"><span className="font-bold">Importante:</span> esta apertura tiene fines educativos e informativos; no constituye una oferta financiera.</p></div>
}

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: ReactNode; className?: string }) { return <label className={`field-label ${className}`}>{label}{children}{error && <span className="mt-1 text-xs font-semibold text-rose-700" role="alert">{error}</span>}</label> }
function Metric({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 py-3"><dt className="text-slate-300">{label}</dt><dd className="text-right font-semibold">{value}</dd></div> }
