import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthContext'
import { UserInfoProvider } from './components/mailing/UserInfoContext'
import { ErrorProvider } from './components/error/ErrorContext'
import { RequireAuth } from './components/auth/RequireAuth'
import { SignIn } from './components/auth/SignIn'
import { Dashboard } from './components/mailing/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css'

export const App = () => {
  return (
    <AuthProvider>
    <ErrorProvider>
    <UserInfoProvider>
      <Router>
        <Routes>

          <Route path='/signin' element={<SignIn />} />
          <Route 
            path='/dashboard'
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path='*' element={<Navigate to='/dashboard' />} />

        </Routes>
      </Router>
    </UserInfoProvider>
    </ErrorProvider>
    </AuthProvider>
  )
}