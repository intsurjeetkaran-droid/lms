import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeCapacitor } from './mobile/capacitor-setup.js'

// Initialize Capacitor for mobile
initializeCapacitor().then(() => {
  console.log('App ready to render');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
