import { AlertCircle, X } from 'lucide-react'

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-red-800">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-600 hover:text-red-800">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default ErrorMessage