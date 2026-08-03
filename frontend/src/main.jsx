import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      toastStyle={{
        background:     'rgba(15,18,33,0.95)',
        border:         '1px solid rgba(176,110,255,0.25)',
        color:          '#F0F2FF',
        fontFamily:     '"JetBrains Mono", monospace',
        fontSize:       '0.78rem',
        backdropFilter: 'blur(20px)',
        letterSpacing:  '0.3px',
      }}
    />
  </React.StrictMode>,
)