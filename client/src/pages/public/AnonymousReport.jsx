import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { submitAnonymousReport } from '../../store/slices/publicSlice'
import RecordForm from '../../components/forms/RecordForm'
import { CheckCircle, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const AnonymousReport = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingToken, setTrackingToken] = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const result = await dispatch(submitAnonymousReport(formData))
      if (result.type.endsWith('/fulfilled')) {
        setTrackingToken(result.payload.tracking_token)
        setSubmitted(true)
        toast.success('Report submitted successfully!')
      } else {
        toast.error(result.payload || 'Failed to submit report')
      }
    } catch (error) {
      toast.error('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  const copyTrackingToken = () => {
    navigator.clipboard.writeText(trackingToken)
    toast.success('Tracking token copied!')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Report Submitted Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your anonymous report has been submitted and is now under investigation. 
            Save your tracking token to check status later.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Tracking Token:</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <code className="text-sm font-mono text-primary-800">{trackingToken}</code>
              <button
                onClick={copyTrackingToken}
                className="text-gray-500 hover:text-primary-800 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/records'}
              className="btn-primary w-full"
            >
              View All Reports
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-secondary w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Report Anonymously
          </h1>
          <p className="text-lg text-gray-600">
            Submit a corruption report or intervention request without creating an account. 
            Your identity will remain completely anonymous.
          </p>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-900 mb-2">Anonymous Reporting Notice</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your identity will not be recorded or tracked</li>
            <li>• You'll receive a tracking token to check report status</li>
            <li>• Reports go directly to investigation status</li>
            <li>• No email notifications (save your tracking token!)</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <RecordForm
            onSubmit={handleSubmit}
            onCancel={() => window.history.back()}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default AnonymousReport