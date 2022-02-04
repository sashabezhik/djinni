import React from 'react'
import { useError } from './ErrorContext'

export const Error = () => {
    const { error: { visible, text } } = useError()

    if (!visible) return null

    return (
        <div className='pt-2 text-start'>
            <span className='lato error'>{text}</span>
        </div>
    )
}