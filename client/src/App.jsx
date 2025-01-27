import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position='top-center' />
        <Outlet/>

    </>
  )
}

export default App
