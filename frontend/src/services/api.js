import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api'

const api = {
  getStatus: async () => {
    const response = await axios.get(`${API_BASE}/status`)
    return response.data
  },

  startAggregation: async () => {
    const response = await axios.post(`${API_BASE}/aggregate`)
    return response.data
  },

  getResults: async () => {
    const response = await axios.get(`${API_BASE}/results`)
    return response.data
  },

  getStats: async () => {
    const response = await axios.get(`${API_BASE}/stats`)
    return response.data
  }
}

export default api
