import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App'
import { queryClient } from './shared/api/query-client'

import "leaflet/dist/leaflet.css";
import "./styles/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
