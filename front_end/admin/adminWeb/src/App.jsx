import { useState } from 'react'
import React from 'react'
import './App.css'
import Navbar from './components/navbar'
import Sidebar from './components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='px-4 sm:px=[5vw] md:px=[7vw] lg:px-[9vw]'>
       <Navbar/>
       <Sidebar/>
    </div>
     
    </>
  )
}

export default App
