import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-canvas text-ink">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link className="flex items-center gap-3 font-display text-xl font-bold tracking-tight" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-magenta text-lg text-white" aria-hidden="true">↗</span>
          Inversiones <span className="hidden text-muted sm:inline">demo</span>
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-1 text-sm font-semibold">
          <NavLink end to="/" className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-pink-50 text-magenta' : 'text-muted hover:bg-slate-50 hover:text-ink'}`}>Mis inversiones</NavLink>
          <NavLink to="/simular" className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-pink-50 text-magenta' : 'text-muted hover:bg-slate-50 hover:text-ink'}`}>Simular</NavLink>
        </nav>
      </div>
    </header>
    <main>{children}</main>
  </div>
}
