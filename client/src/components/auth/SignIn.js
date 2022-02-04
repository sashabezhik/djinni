import React, { useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useError } from '../error/ErrorContext'
import { useFetch } from '../../hooks/fetch.hook'
import { CompanyInfoScreen } from './CompanyInfoScreen'
import { SignInScreen } from './SignInScreen'
import '../../css/signIn.css'

export const SignIn = () => {
    const { isAuthenticated, login } = useAuth()
    const { loading, request } = useFetch()
    const { showError, hideError } = useError()
    const navigate = useNavigate()

    const email = useRef(null)
    const password = useRef(null)

    useEffect(() => {
        /* eslint-disable */
        hideError()
    }, [])

    const loginHandler = async (event) => {
        try {
            event.preventDefault()

            const { token } = await request(
                '/auth/login', 
                'POST', 
                { email: email.current.value, password: password.current.value }
            )

            login(token)
            navigate('/dashboard')
        } catch (err) {
            showError(err.message)
        }
    }

    return (
        <div>
            {isAuthenticated ? <Navigate to='/dashboard' /> : 
                <div className='container-fluid vh-100'>
                    <div className='row h-100'>

                        <CompanyInfoScreen />
                        <SignInScreen 
                            loginHandler={loginHandler} 
                            loading={loading}
                            refs={{ email, password }}
                        />

                    </div>
                </div>
            }
        </div>
    )
}