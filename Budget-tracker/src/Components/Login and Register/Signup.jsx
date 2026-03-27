import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { Mail, LockKeyhole, ShieldCheck, Eye, EyeOff, ShieldUser, KeyRound } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Button } from '../ui/Button';

const base_url = 'https://budget-backend-dl8u.onrender.com/api/'

const Signup = () => {
  const [formData, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmpassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await axios.post(`${base_url}register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      setUserEmail(formData.email)
      toast.success('Account created! Check your email for the verification code.')
      setShowOTPModal(true)
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data
        if (data.username?.[0]?.includes('already') || data.email?.[0]?.includes('already')) {
          toast.error('User already exists')
        } else {
          toast.error('Registration failed: ' + (Object.values(data)[0]?.[0] || 'Unknown error'))
        }
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input — auto move to next box
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }

    try {
      setVerifying(true)
      const res = await axios.post(`${base_url}verify-otp/`, {
        email: userEmail,
        code: code,
      })

      toast.success('Email verified! Redirecting to dashboard...')

      // Store tokens and redirect to dashboard
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)

      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid or expired OTP'
      toast.error(msg)
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      setResending(true)
      await axios.post(`${base_url}resend-otp/`, { email: userEmail })
      toast.success('New code sent to your email!')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } catch (err) {
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(135deg,#000000,#19231e)]">

      {/* Signup Form */}
      {!showOTPModal && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(18,18,18,0.75)] backdrop-blur-lg p-8 shadow-[0_0_30px_rgba(0,0,0,0.2)] [background-image:radial-gradient(circle_at_top_left,rgba(0,255,178,0.2),transparent_40%)]"
        >
          <h2 className="text-[1.8rem] font-bold text-center text-white mb-1">Create an Account</h2>
          <p className="text-center text-[#aaa] text-xs mb-8">Register as a new user here</p>

          {/* Username */}
          <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden mb-5 px-3">
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="flex-1 py-3 bg-transparent text-white placeholder-white/40 text-[0.95rem] outline-none"
            />
            <ShieldUser size={18} className="text-[rgb(74,100,90)]" />
          </div>

          {/* Email */}
          <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden mb-5 px-3">
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 py-3 bg-transparent text-white placeholder-white/40 text-[0.95rem] outline-none"
            />
            <Mail size={18} className="text-[rgb(74,100,90)]" />
          </div>

          {/* Password */}
          <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden mb-5 px-3">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 py-3 bg-transparent text-white placeholder-white/40 text-[0.95rem] outline-none"
            />
            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-[rgb(93,138,114)] mr-2">
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </span>
            <LockKeyhole size={18} className="text-[rgb(74,100,90)]" />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden mb-5 px-3">
            <input
              id="confirmpassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
              className="flex-1 py-3 bg-transparent text-white placeholder-white/40 text-[0.95rem] outline-none"
            />
            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-[rgb(93,138,114)] mr-2">
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </span>
            <ShieldCheck size={18} className="text-[rgb(74,100,90)]" />
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all duration-300"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <p className="text-center mt-4 text-[#888] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00bfff] hover:underline">Log in here</Link>
          </p>
        </form>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(18,18,18,0.75)] backdrop-blur-lg p-8 shadow-[0_0_30px_rgba(0,0,0,0.2)] [background-image:radial-gradient(circle_at_top_left,rgba(0,255,178,0.2),transparent_40%)]">
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">Verify Your Email</h2>
          <p className="text-center text-[#aaa] text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-center text-primary font-semibold mb-8">{userEmail}</p>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold text-white bg-white/5 border border-white/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
            ))}
          </div>

          <Button
            onClick={handleVerifyOTP}
            disabled={verifying}
            size="lg"
            className="w-full hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all duration-300 mb-4"
          >
            {verifying ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="text-center">
            <p className="text-[#888] text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-primary hover:underline text-sm font-medium disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <p className="text-center text-[#666] text-xs mt-4">
            Code expires in 10 minutes
          </p>
        </div>
      )}

    </div>
  )
}

export default Signup