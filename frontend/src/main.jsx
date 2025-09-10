import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider as CustomToastProvider } from './hooks/use-toast';
import { ToastProvider as RadixToastProvider } from './components/ui/toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <RadixToastProvider>
        <CustomToastProvider>
          <App />
        </CustomToastProvider>
      </RadixToastProvider>
    </Router>
  </StrictMode>,
)
