import { RECORD_STATUS, RECORD_TYPES, URGENCY_LEVELS } from '../../constants'

const RecordFilters = ({ filters, onFilterChange }) => {
  const updateFilter = (key, value) => {
    onFilterChange({ [key]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="input-field"
        >
          <option value="all">All Status</option>
          <option value={RECORD_STATUS.INVESTIGATING}>Under Investigation</option>
          <option value={RECORD_STATUS.RESOLVED}>Resolved</option>
          <option value={RECORD_STATUS.REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="input-field"
        >
          <option value="all">All Types</option>
          <option value={RECORD_TYPES.RED_FLAG}>Red Flag</option>
          <option value={RECORD_TYPES.INTERVENTION}>Intervention</option>
          <option value={RECORD_TYPES.INCIDENT}>Incident</option>
          <option value={RECORD_TYPES.EMERGENCY}>Emergency</option>
        </select>
      </div>

      {/* Urgency Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency
        </label>
        <select
          value={filters.urgency}
          onChange={(e) => updateFilter('urgency', e.target.value)}
          className="input-field"
        >
          <option value="all">All Levels</option>
          <option value={URGENCY_LEVELS.CRITICAL}>Critical</option>
          <option value={URGENCY_LEVELS.HIGH}>High</option>
          <option value={URGENCY_LEVELS.MEDIUM}>Medium</option>
          <option value={URGENCY_LEVELS.LOW}>Low</option>
        </select>
      </div>
    </div>
  )
}

export default RecordFilters