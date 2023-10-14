import axios from 'axios'
import React, { useState } from 'react'

function Register() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
   async function register(e){
    e.preventDefault()
      await axios.post('/register',{username,password})
    } 
  return (

    <div className='bg-blue-50 h-screen flex items-center'> 
    <form className='w-64 mx-auto mb-12' onSubmit={register}>
        <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='username' className='block w-full mb-2 p-2 border ' />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='password' className='block w-full mb-2 p-2 border '/>
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>Register</button>
    </form>
    </div>
  ) 
}

export default Register