import { useState } from 'react'
import { Tldraw } from 'tldraw'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
    <Tldraw />
  </div>
)
}

export default App
