import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [drivers, setDrivers] = useState([])
  const [riderName, setRiderName] = useState('')
  const [riderPhone, setRiderPhone] = useState('')
  const [pickup, setPickup] = useState({ lat: 37.7749, lng: -122.4194 })
  const [dropoff, setDropoff] = useState({ lat: 37.7849, lng: -122.4094 })
  const [rideResp, setRideResp] = useState(null)

  useEffect(() => {
    fetch(`${API}/drivers`).then(r=>r.json()).then(setDrivers).catch(()=>{})
  }, [])

  const requestRide = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/rides/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rider_name: riderName || 'Guest Rider',
        rider_phone: riderPhone || Math.random().toString().slice(2,12),
        pickup, dropoff
      })
    })
    const data = await res.json()
    setRideResp(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">SwiftRide</h1>
        <div className="text-gray-600">Simple Uber-like demo</div>
      </header>

      <main className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 p-6">
        <section className="bg-white/90 backdrop-blur rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Request a Ride</h2>
          <form onSubmit={requestRide} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input value={riderName} onChange={e=>setRiderName(e.target.value)} placeholder="Your name" className="border rounded px-3 py-2" />
              <input value={riderPhone} onChange={e=>setRiderPhone(e.target.value)} placeholder="Phone" className="border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Pickup (lat, lng)</div>
                <div className="flex gap-2">
                  <input type="number" step="any" value={pickup.lat} onChange={e=>setPickup(p=>({...p, lat: parseFloat(e.target.value)}))} className="border rounded px-3 py-2 w-full" />
                  <input type="number" step="any" value={pickup.lng} onChange={e=>setPickup(p=>({...p, lng: parseFloat(e.target.value)}))} className="border rounded px-3 py-2 w-full" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Dropoff (lat, lng)</div>
                <div className="flex gap-2">
                  <input type="number" step="any" value={dropoff.lat} onChange={e=>setDropoff(p=>({...p, lat: parseFloat(e.target.value)}))} className="border rounded px-3 py-2 w-full" />
                  <input type="number" step="any" value={dropoff.lng} onChange={e=>setDropoff(p=>({...p, lng: parseFloat(e.target.value)}))} className="border rounded px-3 py-2 w-full" />
                </div>
              </div>
            </div>
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">Request Ride</button>
          </form>
          {rideResp && (
            <div className="mt-4 p-4 rounded bg-blue-50 text-blue-800">
              <div className="font-medium">Ride created</div>
              <div className="text-sm">ID: {rideResp.ride_id}</div>
              <div className="text-sm">Status: {rideResp.status}</div>
              <div className="text-sm">Driver: {rideResp.driver_id || 'Pending assignment'}</div>
            </div>
          )}
        </section>

        <section className="bg-white/90 backdrop-blur rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nearby Drivers</h2>
          {drivers.length === 0 ? (
            <div className="text-gray-500">No drivers yet. Add some via API or seed.</div>
          ) : (
            <ul className="divide-y">
              {drivers.map(d => (
                <li key={d._id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.name} • {d.car_model}</div>
                    <div className="text-sm text-gray-500">Plate {d.plate} • {d.is_available ? 'Available' : 'On a ride'}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${d.is_available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.is_available ? 'Available' : 'Busy'}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
