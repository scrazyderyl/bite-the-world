import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { OverlayProvider } from './OverlayContext.jsx'

import "react-toastify/dist/ReactToastify.css";
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <OverlayProvider>
        <App />
      </OverlayProvider>
      <ToastContainer/>
    </BrowserRouter>
  </StrictMode>,
)
