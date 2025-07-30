import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

export default ProtectedRoute