import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FinancasAve from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinancasAve />
  </StrictMode>
)
