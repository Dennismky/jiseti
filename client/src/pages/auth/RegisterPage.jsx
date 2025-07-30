import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const RegisterPage = () => {
  const { register, loading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })

  useEffect(() => {
    return () => clearError()
  }, [])

  useEffect(() => {
    checkPasswordStrength(formData.password)
  }, [formData.password])

  const checkPasswordStrength = (password) => {
    const feedback = []
    let score = 0

    if (password.length >= 6) {
      score += 1
      feedback.push('✓ At least 6 characters')
    } else {
      feedback.push('✗ At least 6 characters')
    }

    if (/[a-z]/.test(password)) {
      score += 1
      feedback.push('✓ Contains lowercase letter')
    } else {
      feedback.push('✗ Contains lowercase letter')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
      feedback.push('✓ Contains uppercase letter')
    } else {
      feedback.push('✗ Contains uppercase letter')
    }

    if (/\d/.test(password)) {
      score += 1
      feedback.push('✓ Contains number')
    } else {
      feedback.push('✗ Contains number')
    }

    setPasswordStrength({ score, feedback })
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@gmail\.com$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(formData.email)) {
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      return
    }
    
    const { confirmPassword, ...userData } = formData
    await register(userData)
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary-800 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join Jiseti</h1>
          <p className="text-primary-100">Create your account to start reporting</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`input-field ${formData.email && !validateEmail(formData.email) ? 'border-red-300' : ''}`}
                placeholder="Enter your Gmail address"
                required
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="text-red-600 text-sm mt-1">Please enter a valid Gmail address (@gmail.com)</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="input-field pr-10"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="text-xs space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <div
                        key={index}
                        className={item.startsWith('✓') ? 'text-green-600' : 'text-gray-400'}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className={`input-field ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : ''}`}
                placeholder="Confirm your password"
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !validateEmail(formData.email) || formData.password !== formData.confirmPassword || passwordStrength.score < 2}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-800 hover:text-primary-700 font-medium">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage