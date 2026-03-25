import React, { useState} from 'react';
import {useNavigate} from 'react-router-dom'
import { UserCheck,User,Mail, LockKeyhole, ShieldCheck, Eye, EyeOff, ShieldUser } from 'lucide-react'
import {toast} from 'react-toastify'
import './Register.css'
import axios from 'axios'
import { Button } from '../Ui/Button';


const base_url='http://127.0.0.1:8000/api/register/'


const Signup = () => {
   const [formData, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  })

  const [showPassword, setShowPasword]=useState(false);
  const [loading, setLoading ] = useState(false)
  const navigate =useNavigate();

  const handleChange = (e) => {
    setForm({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error('Password Not Match');
      return
    }

    try {
      setLoading(true)
      await axios.post(base_url, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success('User registered successfully');
      navigate('/login')
    }catch (err) {
       if(err.response && err.response.data){
        const data=err.response.data
         if (data.username?.[0]?.includes('already') || data.email?.[0]?.includes('already')) {
          toast.error('User already exists');
          } else {
          toast.error('Registration failed: ' + (Object.values(data)[0]?.[0] || 'Unknown error'));
        }
    } else {
      toast.error ('Registration failed. please again with different details')
    }
   } finally {
    setLoading (false)
   }

  };

  return (
    <div className="auth-wrapper container-fluid py-5 home">
      
      <form className="row justify-content-center theform" onSubmit={handleSubmit}>
         <h2 className="mb-4 text-center">Create an Account</h2>
            <p className='Subtext'>Register As A New user Here</p>

          {/* <div className="mb-3 form-control ">
              <input
                type="text"
                id="name"
                className="data-input"
                placeholder="Enter your Name"
                required
              />
              <UserCheck className='regicon'/>
          </div> */}

           <div className="mb-3 form-control ">
              <input
                type="text"
                id="username"
                className="data-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
              <ShieldUser className='regicon' />
          </div>


          <div className="mb-3 form-control">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="data-input"
              placeholder="Enter your email address"
              required
            />
            <Mail className='regicon'/>
          </div>

          <div className="mb-3 form-control password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="data-input"
              placeholder="Create a strong password"
              required
            />
            <span
            className='eye-icon'
            onClick={() => setShowPasword(!showPassword)}
            >{showPassword ?<Eye /> : <EyeOff /> } </span>
            <LockKeyhole className='regicon'/>
          </div>

          <div className="mb-3 form-control password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              className="data-input"
              placeholder="Comfirm password"
              required
            />
             <span
            className='eye-icon'
            onClick={() => setShowPasword(!showPassword)}
            >{showPassword ?<Eye /> : <EyeOff /> } </span>
            <ShieldCheck className='regicon'/>
          </div>

          <Button 
            type="Submit"
            disabled={loading}
            size="lg"
            className='w-full hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all duration-300'
          >
            {loading ? 'Registering...' : 'Sign up'}
          </Button>


          <p className="text-center mt-3 signup-text">
            Already have an account? <a href="/login">Log in here</a>
          </p>
      </form>
    </div>
  );
}

export default Signup;
