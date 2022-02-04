import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to='/signin' />
    }

    return children
}