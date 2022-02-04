import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { useLocalStorage } from '../../hooks/localStorage.hook'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState(null)
    const { setItem, getItemByKey, removeItemByKey } = useLocalStorage()

    const login = useCallback(token => {
        /* eslint-disable */
        setIsAuthenticated(true)
        setToken(token)
        setItem('djinni-token', token)
    }, [])

    const logout = useCallback(() => {
        /* eslint-disable */
        setIsAuthenticated(false)
        setToken(null)
        removeItemByKey('djinni-token')
    }, [])

    useEffect(() => {
        /* eslint-disable */
        const token = getItemByKey('djinni-token')
        if (token) login(token)
    }, [login])

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
            { children }
        </AuthContext.Provider>
    )
}