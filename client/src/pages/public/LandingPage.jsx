import { Link } from 'react-router-dom'
import { Shield, MapPin, RefreshCw, Users, Eye, Flag } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="bg-primary-800 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fight Corruption, Build a Better Africa
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Jiseti empowers every citizen to report corruption and request government intervention.
            Your voice matters in building transparent, accountable governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="bg-accent-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Report Red Flag
            </Link>
            <Link to="/records" className="bg-primary-700 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-primary-600">
              View Reports
            </Link>
            <Link to="/map" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-primary-500">
              Map View
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Jiseti?</h2>
            <p className="text-xl text-gray-600">Powerful tools for transparency and accountability</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Anonymous Reporting</h3>
              <p className="text-gray-600">Report incidents safely and anonymously with full protection of your identity.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Geolocation Tracking</h3>
              <p className="text-gray-600">Precise location marking for accurate incident reporting and mapping.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-primary-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">Track your report status from submission to resolution with instant notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent-500 mb-2">1,250+</div>
              <div className="text-primary-100">Cases Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-500 mb-2">87%</div>
              <div className="text-primary-100">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-500 mb-2">50K+</div>
              <div className="text-primary-100">Citizens Engaged</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of citizens working to build a corruption-free Africa
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage