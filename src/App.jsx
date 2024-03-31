import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import List from './pages/list'
import { useDispatch } from 'react-redux'
import { getEmployeesDispatch } from './services/employees'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(getEmployeesDispatch(true))
  }, [])
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/employees' element={<List/>} />
      </Routes>
    </>
  )
}

export default App
