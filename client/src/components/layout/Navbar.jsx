import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-800">Jiseti</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-800 transition-colors">
              Home
            </Link>
            <Link to="/records" className="text-gray-700 hover:text-primary-800 transition-colors">
              View Reports
            </Link>
            <Link to="/map" className="text-gray-700 hover:text-primary-800 transition-colors">
              Map View
            </Link>
            {!isAuthenticated && (
              <Link to="/report" className="text-gray-700 hover:text-primary-800 transition-colors">
                Report Issue
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                <Link 
                  to={role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn-secondary"
                >
                  Dashboard
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-800">
                  Sign In
                </Link>
                <button onClick={handleGetStarted} className="btn-primary">
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/records" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                View Reports
              </Link>
              <Link to="/map" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                Map View
              </Link>
              {!isAuthenticated && (
                <Link to="/report" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  Report Issue
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={role === 'admin' ? '/admin' : '/dashboard'}
                    className="text-primary-800 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-red-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <button 
                    onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                    className="btn-primary w-fit"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar