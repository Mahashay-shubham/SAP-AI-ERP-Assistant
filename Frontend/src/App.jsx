import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Materials from './pages/Materials'
import Vendors from './pages/Vendors'
import PurchaseOrders from './pages/PurchaseOrders'
import Inventory from './pages/Inventory'
import AIAssistant from './pages/AIAssistant'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route
          path="/materials"
          element={<Materials />}
        />
        <Route
          path="/vendors"
          element={<Vendors />}
        />
        <Route
          path="/purchase-orders"
          element={<PurchaseOrders />}
        />
        <Route
          path="/inventory"
          element={<Inventory />}
        />
        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />
      </Route>


      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  )
}

export default App