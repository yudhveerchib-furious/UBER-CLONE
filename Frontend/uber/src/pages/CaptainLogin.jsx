import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const CaptainLogin = () => {




    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [captainData,setCaptainData] = useState({})
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setCaptainData({
            email: email,
            password: password,

        })
        setEmail('')
        setPassword('')
    }
    return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
         <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
            <form onSubmit={(e)=>handleFormSubmit(e)}>
                <h3 className='text-lg font-medium mb-2'> What's your email </h3>
                
                <input value={email} onChange={(e)=>setEmail(e.target.value)} required className='bg-[#eeeeee] mb-7 font-medium rounded px-4 py-2 border w-full text-lg placeholder:text-base' type='email' placeholder='email@example.com' />
                 <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                 <input value={password} onChange={(e)=>setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 font-medium rounded px-4 py-2 border w-full text-lg placeholder:text-base' required type="password" placeholder='pasword'/>
                 <button className='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 border w-full text-lg placeholder:text-base' >Login</button>
            <p className='text-center'>New here?
                <Link to='/captain-signup' className='text-blue-600'> 
             Join the fleet
             </Link>
             </p>
              </form>
      </div>
          <Link
             to='/login' className='bg-[#676767] flex items-center justify-center text-white font-semibold mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'>Sign in as User
            </Link>  
        </div>
  )

}
export default CaptainLogin