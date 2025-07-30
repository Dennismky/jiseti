import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import LandingPage from './pages/public/LandingPage'
import PublicRecords from './pages/public/PublicRecords'
import MapView from './pages/public/MapView'
import AnonymousReport from './pages/public/AnonymousReport'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserDashboard from './pages/user/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="records" element={<PublicRecords />} />
          <Route path="map" element={<MapView />} />
          <Route path="report" element={<AnonymousReport />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App