import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import List from './pages/list'
import { useDispatch } from 'react-redux'
import { getEmployeesDispatch } from './services/employees'
import Edit from './pages/edit'
import { getRolesDispatch } from './services/roles'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(getEmployeesDispatch(true))
      dispatch(getRolesDispatch())
  }, [])
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/employees' element={<List/>} />
        <Route path='/employees/:id' element={<Edit/>}/>
      </Routes>
    </>
  )
}

export default App
