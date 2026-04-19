import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { StadiumProvider } from './context/StadiumContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <StadiumProvider>
        <App />
      </StadiumProvider>
    </AuthProvider>
  </React.StrictMode>,
)
