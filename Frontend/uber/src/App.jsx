import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/userSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import { UserDataContext } from './context/UserContext'

const App = () => {
  const ans = useContext(UserDataContext)
  return (
    // <div children='bg-rose-400'>App</div>

    
     <Routes>
       <Route path='/' element={<Home />} />
       <Route path='/login' element={<UserLogin/>}/> 
       <Route path='/signup' element={<UserSignup/>}/> 
       <Route path='/captain-login' element={<CaptainLogin/>}/> 
       <Route path='/captain-signup' element={<CaptainSignup/>}/>
     </Routes>
  )
}

export default App