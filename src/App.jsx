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
        <Route path='/employees' element={<List />} />
        <Route path='/employees/edit/:id' element={<Edit />} />
        <Route path='/employees/add' element={<Edit />} />
      </Routes>
      {/* <div className='image'> */}
        <img className='image' src='https://img.freepik.com/premium-photo/business-office-design-background-ui-ux-design_155807-284.jpg?w=2000'/> 
      {/* </div> */}
    </>
  )
}

export default App
