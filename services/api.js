const API_BASE = import.meta.env.VITE_API_URL || '/api'

const request = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error(`API Error: ${response.status}`)
  return response.json()
}

export const get = (endpoint) => request(endpoint)
export const post = (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) })
