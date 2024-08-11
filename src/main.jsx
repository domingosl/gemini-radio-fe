import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './reset.css'
import './index.css'
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
      </ThemeProvider>
  </>
)
