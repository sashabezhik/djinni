import React, { createContext, useState, useContext } from 'react'

const ErrorContext = createContext()

export const useError = () => {
    return useContext(ErrorContext)
}

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState({ visible: false })

    const showError = text => setError({ visible: true, text })

    const hideError = () => setError({ visible: false })

    return (
        <ErrorContext.Provider value={{ error, showError, hideError }}>
            { children }
        </ErrorContext.Provider>
    )
}