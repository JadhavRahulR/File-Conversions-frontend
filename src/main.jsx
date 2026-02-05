import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { LoaderProvider } from './LoaderContext.jsx';
import GlobalLoader from './GlobalLoader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <HelmetProvider>
      <LoaderProvider>
<GlobalLoader/>

    <App />
      </LoaderProvider>
    </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)
