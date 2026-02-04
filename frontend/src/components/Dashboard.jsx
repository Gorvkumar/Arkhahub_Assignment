import StatsCard from './StatsCard'
import ProgressBar from './ProgressBar'
import DeviceTable from './DeviceTable'
import PowerChart from './PowerChart'

function Dashboard({ status, stats, results, loading, onStartAggregation }) {
  const isRunning = status?.inProgress
  const hasResults = status?.hasResults && results

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <button
            onClick={onStartAggregation}
            disabled={isRunning || loading}
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
              isRunning 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:-translate-y-1'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Aggregating Data...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Start Data Aggregation
              </>
            )}
          </button>
          
          {isRunning && status?.progress && (
            <ProgressBar
              completed={status.progress.completed}
              total={status.progress.total}
            />
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard title="Total Devices" value={stats.total} color="border-green-500" />
            <StatsCard title="Online" value={stats.online} color="border-blue-500" />
            <StatsCard title="Offline" value={stats.offline} color="border-orange-500" />
            <StatsCard title="Total Power" value={`${stats.totalPower} kW`} color="border-purple-500" />
            <StatsCard title="Avg Power" value={`${stats.avgPower} kW`} color="border-cyan-500" />
            <StatsCard title="Uptime" value={`${stats.uptime}%`} color="border-red-500" />
          </div>
        )}

        {hasResults && (
          <>
            <div className="mb-8">
              <PowerChart devices={results.success.slice(0, 50)} />
            </div>
            <DeviceTable devices={results.success} />
          </>
        )}

        {!hasResults && !isRunning && (
          <div className="bg-white rounded-xl p-16 text-center shadow-md">
            <svg className="w-24 h-24 mx-auto mb-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600">Click "Start Data Aggregation" to fetch telemetry from 500 solar inverters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
