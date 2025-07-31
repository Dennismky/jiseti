import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, logout, clearError } from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, role, loading, error } = useSelector(state => state.auth)

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (result.type.endsWith('/fulfilled')) {
      const userRole = result.payload.user ? 'user' : 'admin'
      navigate(userRole === 'admin' ? '/admin' : '/dashboard')
    }
    return result
  }

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData))
    if (result.type.endsWith('/fulfilled')) {
      navigate('/dashboard')
    }
    return result
  }

  const logoutUser = () => {
    dispatch(logout())
    navigate('/')
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    user,
    isAuthenticated,
    role,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError, 
  }
}