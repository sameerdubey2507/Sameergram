import React from 'react'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'

function App() {


  return (
    <div className="mobile-wrapper">
      <div className="mobile-container">
        <AppRoutes />
      </div>
    </div>
  )
}

export default App
