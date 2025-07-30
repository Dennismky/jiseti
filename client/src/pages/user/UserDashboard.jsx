import { useEffect, useState } from 'react'
import { useRecords } from '../../hooks/useRecords'
import { useAuth } from '../../hooks/useAuth'
import { Plus, FileText, Clock, CheckCircle, X, Edit, Trash2, Eye } from 'lucide-react'
import { formatDate, getStatusColor } from '../../utils/helpers'
import RecordForm from '../../components/forms/RecordForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const { user } = useAuth()
  const { records, loading, error, stats, loadRecords, create, update, remove } = useRecords()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [filter, setFilter] = useState('all')
  const [createLoading, setCreateLoading] = useState(false)

  useEffect(() => {
    loadRecords()
  }, [])

  const handleCreateRecord = async (formData) => {
    setCreateLoading(true)
    try {
      const result = await create(formData)
      if (result.type.endsWith('/fulfilled')) {
        setShowCreateModal(false)
        toast.success('Record created successfully!')
      } else {
        toast.error(result.payload || 'Failed to create record')
      }
    } catch (error) {
      toast.error('Failed to create record')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleUpdateRecord = async (formData) => {
    setCreateLoading(true)
    try {
      const result = await update(editingRecord.id, formData)
      if (result.type.endsWith('/fulfilled')) {
        setEditingRecord(null)
        toast.success('Record updated successfully!')
      } else {
        toast.error(result.payload || 'Failed to update record')
      }
    } catch (error) {
      toast.error('Failed to update record')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    
    try {
      const result = await remove(id)
      if (result.type.endsWith('/fulfilled')) {
        toast.success('Record deleted successfully!')
      } else {
        toast.error(result.payload || 'Failed to delete record')
      }
    } catch (error) {
      toast.error('Failed to delete record')
    }
  }

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true
    return record.status === filter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your reports today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.investigating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Report</span>
            </button>
            <button
              onClick={() => loadRecords()}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Records Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">My Reports</h2>
              
              {/* Filter */}
              <div className="flex space-x-2">
                {['all', 'draft', 'under investigation', 'resolved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === status
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6 border-b">
              <ErrorMessage message={error} />
            </div>
          )}

          {/* Records List */}
          <div className="divide-y">
            {loading ? (
              <div className="p-12 text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading your records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === 'all' ? 'No records found' : `No ${filter} records`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "Get started by creating your first report"
                    : `You don't have any ${filter} records yet`
                  }
                </p>
                {filter === 'all' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    Create First Report
                  </button>
                )}
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <span className={`status-badge ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                        {record.type && (
                          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                            {record.type}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {record.description}
                      </p>

                      {/* Media Preview */}
                      {(record.image_url || record.video_url) && (
                        <div className="mb-3">
                          {record.image_url && (
                            <img
                              src={record.image_url}
                              alt="Evidence"
                              className="w-24 h-16 object-cover rounded border"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <span>Created: {formatDate(record.created_at)}</span>
                        {record.latitude && record.longitude && (
                          <span className="ml-4">• Location: {parseFloat(record.latitude).toFixed(4)}, {parseFloat(record.longitude).toFixed(4)}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {record.status === 'draft' && (
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="p-2 text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Record Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Create New Report</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RecordForm
                  onSubmit={handleCreateRecord}
                  onCancel={() => setShowCreateModal(false)}
                  loading={createLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Record Modal */}
        {editingRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Edit Report</h2>
                  <button
                    onClick={() => setEditingRecord(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RecordForm
                  initialData={editingRecord}
                  onSubmit={handleUpdateRecord}
                  onCancel={() => setEditingRecord(null)}
                  loading={createLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard