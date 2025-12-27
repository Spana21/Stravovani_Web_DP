import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginScreen from './LoginScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginScreen />
  </StrictMode>,
)
