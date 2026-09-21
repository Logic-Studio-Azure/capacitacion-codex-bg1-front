import { Link } from 'react-router-dom'

export function LoadingBlock({ label = 'Cargando información…' }: { label?: string }) {
  return <div className="grid min-h-64 place-items-center" role="status" aria-live="polite">
    <div className="text-center text-muted"><span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-4 border-pink-100 border-t-magenta" />{label}</div>
  </div>
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center" role="alert">
    <h2 className="font-display text-lg font-bold text-ink">No pudimos cargar esta información</h2>
    <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{message}</p>
    <button className="secondary-button mt-5" onClick={onRetry}>Reintentar</button>
  </section>
}

export function EmptyState({ filtered = false }: { filtered?: boolean }) {
  return <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-xl text-magenta" aria-hidden="true">⌁</span>
    <h2 className="mt-5 font-display text-xl font-bold">{filtered ? 'No encontramos coincidencias' : 'Aún no tienes inversiones'}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{filtered ? 'Prueba ajustar o limpiar los filtros para ver otros registros.' : 'Cuando tengas una inversión activa, podrás consultarla desde este espacio.'}</p>
    {!filtered && <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link className="primary-button" to="/simular">Simular inversión</Link>
      <button className="secondary-button" disabled title="La apertura estará disponible próximamente">Abrir inversión</button>
    </div>}
  </section>
}
