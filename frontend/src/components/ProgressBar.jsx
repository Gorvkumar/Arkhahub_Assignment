function ProgressBar({ completed, total }) {
  const percentage = Math.round((completed / total) * 100)

  return (
    <div className="mt-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Processing batches...</span>
        <span className="font-semibold text-purple-600">
          {completed} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
