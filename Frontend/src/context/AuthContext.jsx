import { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  )

  const login = async (email, password) => {
    const response = await authService.login(email, password)

    setIsAuthenticated(true)

    return response
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}