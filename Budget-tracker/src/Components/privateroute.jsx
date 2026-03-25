import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './Context/AuthContext'

const privateroute = ({children}) => {
    const {accessToken, loading} = useAuth()

    if (loading) {
        return <p className='text-center py-10'>Loading ......</p>
    }


  return accessToken ? children : <Navigate to="/login"  replace />
}

export default privateroute 