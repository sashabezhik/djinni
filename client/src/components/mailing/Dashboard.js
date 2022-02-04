import React, { useState, useEffect } from 'react'
import { useUserInfo } from './UserInfoContext'
import { Image } from 'react-bootstrap'
import { Navbar } from './Navbar'
import { Content } from './Content'
import companyLogo from '../../images/logoDashboard.png'
import '../../css/mailing.css'

export const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const { requestEmail, requestMailings } = useUserInfo()

    useEffect(() => {
        const fetchData = async () => {
            try {
                await requestEmail()
                await requestMailings()

                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log(err.message)
            }
        }

        fetchData()
    }, [])  

    return (
        <>
            {!loading &&
                <div className='d-flex flex-column min-vh-100'>

                    <Navbar />

                    <Content />
                    
                    <Image 
                        src={companyLogo}                            
                        alt='logo'
                        className='dashboard-logo'
                    />

                </div>
            }
        </>
    )
}