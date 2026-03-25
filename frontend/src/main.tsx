import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'          // or ./App.jsx
import './index.css'                 // or main.css if you renamed

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>          {/* ← wrap your app */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)