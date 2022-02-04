import React from 'react'
import { Container, Image, Button } from 'react-bootstrap'
import { useUserInfo } from './UserInfoContext'
import { Mailing } from './Mailing'
import plus from '../../images/plus.png'

export const Content = () => {
    const { mailings, createMailing } = useUserInfo()

    return (
        <div className='dashboard-bg d-flex'>
            <Container 
                className='container dashboard-container d-flex flex-column' 
                fluid
            >

                <div 
                    className='d-flex dashboard-mailing-info justify-content-between align-items-center'
                >

                    <span className='lato dashboard-mailing-info-text'>
                        Your letters
                    </span>

                    <Button 
                        className='add-mailing-btn lato'
                        onClick={createMailing}
                    >

                        <Image 
                            src={plus}
                            alt='add'
                            className='plus'
                        />

                        <span className='add-mailing'>
                            Add new mailing
                        </span>

                    </Button>

                </div>


                <div className='d-flex dashboard-mailings'>
                    <div 
                        className='d-flex flex-column w-100 overflow-scroll accordion' 
                        id='accordion'
                    > 

                        {mailings.map((mailing, idx) => {
                            return <Mailing 
                                key={mailing.id} 
                                index={idx} 
                                mailingInfo={mailing} 
                            />
                        })}

                    </div>
                </div>

            </Container>
        </div>
    )
}