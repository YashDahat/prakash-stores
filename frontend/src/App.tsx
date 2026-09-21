// Application shell — provider tree + <AppRoutes/>. Written once; the route table lives in AppRoutes.tsx.
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import AppProviders from './AppProviders'
import AppRoutes from './AppRoutes'
import { Toaster } from './components/ui/sonner'

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProviders>
            <AppRoutes />
            {/* Global toast portal — must be mounted once at the root or every toast.* call is a
                silent no-op (e.g. signup errors would show no feedback at all). */}
            <Toaster />
          </AppProviders>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
