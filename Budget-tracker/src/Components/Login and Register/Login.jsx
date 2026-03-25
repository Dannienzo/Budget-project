import React, { useState } from 'react'
import './Register.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { Button } from '../ui/Button';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { setTokens } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', form);

      setTokens({
        access: res.data.access,
        refresh: res.data.refresh,
      });

      toast.success('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-wrapper container-fluid py-5 home">
      <form onSubmit={handleSubmit} className="row justify-content-center theform">
        <h2 className="mb-4 text-center">Login Here</h2>
        <p className='Subtext'>Welcome Back, Login to your Account</p>

        <div className="mb-3 form-control">
          <input
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="data-input"
            placeholder="Enter your username"
            required
          />
          <Mail className='regicon' />
        </div>

        <div className="mb-3 form-control password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="data-input"
            placeholder="Password"
            required
          />
          <span
            className='eye-icon'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
          <LockKeyhole className='regicon' />
        </div>
        <div className='flex mt-2'>

        <Button 
         type="Submit"
          size="lg"
          className='w-full hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all duration-300'

        >
          Login
        </Button>

        </div>

        <p className="text-center mt-3 signup-text">
          Don't have an account? <a href="/Signup">Create One</a>
        </p>
      </form>
    </div>
  )
}

export default Login
