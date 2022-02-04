import React from 'react'
import { Image } from 'react-bootstrap'
import { SignInForm } from './SignInForm'
import rectangle from '../../images/rectangle.png'

export const SignInScreen = ({ loginHandler, loading, refs }) => {
    return (
        <div 
            className='col px-0 d-flex justify-content-center align-items-center text-center' 
        >

            <div 
                className='d-flex flex-column justify-content-start align-items-center sign-in-block'
            >
                <h1 className='title lato'>Sign In</h1>
                <SignInForm 
                    loginHandler={loginHandler} 
                    loading={loading}
                    refs={refs}
                />
            </div>
            
            <Image 
                src={rectangle} 
                fluid
                className='rectangle'
            />

        </div>
    )
}