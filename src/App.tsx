import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { InvestmentsPage } from './pages/InvestmentsPage'
import { SimulatorPage } from './pages/SimulatorPage'
import { OpeningPage } from './pages/OpeningPage'

const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter

export default function App() {
  return <Router><AppShell><Routes><Route path="/" element={<InvestmentsPage />} /><Route path="/simular" element={<SimulatorPage />} /><Route path="/apertura" element={<OpeningPage />} /><Route path="*" element={<InvestmentsPage />} /></Routes></AppShell></Router>
}
