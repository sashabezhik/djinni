import React from 'react'
import { Navbar as BootstrapNavbar, Container, Image } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { useUserInfo } from './UserInfoContext'
import companyLogo from '../../images/logoWithBg.png'
import logoutBtn from '../../images/logout.png'

export const Navbar = () => {
    const { logout } = useAuth()
    const { email } = useUserInfo()

    return (
        <>
            <BootstrapNavbar className='navbar p-0'>
                <Container className='container'>

                    <BootstrapNavbar.Brand 
                        className='w-100 d-flex m-0 justify-content-between align-items-center'
                    >

                        <Image
                            src={companyLogo}
                            alt='logo'
                            className='logo'
                            fluid
                        />
                        
                        <div className='d-flex align-items-center'>
                            <Image
                                src={logoutBtn}                            
                                alt='logout'
                                className='logout'
                                onClick={logout}
                            />
                            <p className='lato p-dashboard'>
                                Welcome, {email}.
                            </p>
                        </div>

                    </BootstrapNavbar.Brand>

                </Container>
            </BootstrapNavbar>
        </>
    )
}