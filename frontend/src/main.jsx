import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'

import "react-toastify/dist/ReactToastify.css";
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer/>
    </BrowserRouter>
  </StrictMode>,
)
