import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function PowerChart({ devices }) {
  const chartData = devices.map(device => ({
    name: device.sn,
    power: parseFloat(device.power),
    status: device.status
  }))

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Power Output (First 50 Devices)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="power" fill="#7c3aed" name="Power (kW)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PowerChart
