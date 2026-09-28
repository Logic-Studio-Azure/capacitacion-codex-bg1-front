import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { InvestmentsPage } from './pages/InvestmentsPage'
import { SimulatorPage } from './pages/SimulatorPage'
import { OpeningPage } from './pages/OpeningPage'

export default function App() {
  return <BrowserRouter><AppShell><Routes><Route path="/" element={<InvestmentsPage />} /><Route path="/simular" element={<SimulatorPage />} /><Route path="/apertura" element={<OpeningPage />} /><Route path="*" element={<InvestmentsPage />} /></Routes></AppShell></BrowserRouter>
}
