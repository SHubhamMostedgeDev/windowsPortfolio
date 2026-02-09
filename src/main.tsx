import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { WindowProvider } from './context/WindowContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <WindowProvider>
                <App />
            </WindowProvider>
        </ThemeProvider>
    </StrictMode>,
)
