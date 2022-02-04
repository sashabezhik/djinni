import React from 'react'
import { Image } from 'react-bootstrap'
import companyLogo from '../../images/logo.png'
import elipse from '../../images/elipse.png'

export const CompanyInfoScreen = () => {
    return (
        <div 
        className='col px-0 d-flex justify-content-center align-items-end text-center company-screen'
        >

            <div 
                className='d-flex flex-column justify-content-start align-items-center company-info-block'
            >
                <Image src={companyLogo} fluid />
                <p className='mt-5 lato bg-p'>Welcome to</p>
                <p className='lato md-p'>Djinni Hack</p>
                <p className='lato sm-p mt-auto'>Created by Digis.</p>
            </div>

            <Image 
                src={elipse} 
                fluid
                className='elipse'
            />

        </div>
    )
}