import React from 'react'
import { Image } from 'react-bootstrap'
import { StatusButtons } from './StatusButtons'
import arrow from '../../images/arrow.png'

export const MailingHeader = ({ 
    idx, 
    mailing: { id, name, url, status, created },
    loading
}) => (
    <>

        <h2 
            className='d-flex accordion-header' 
            id={`heading-${idx}`}
        >

            <button 
                className='d-flex mailing-btn align-items-center w-100 collapsed' 
                type='button' 
                data-bs-toggle='collapse' 
                data-bs-target={`#collapse-${idx}`}
                aria-expanded='true' 
                aria-controls={`collapse-${idx}`}
            >

                <Image 
                    src={arrow}                            
                    alt='arrow'
                    className='mailing-arrow arrow-closed'
                />

                <span className='lato mailing-name'>{name}</span>

            </button>

            <StatusButtons 
                mailingInfo={{ id, url, status, created }} 
                loading={loading}
            />

        </h2>

        <div 
            id={`collapse-${idx}`} 
            className='accordion-collapse collapse'
            aria-labelledby={`heading-${idx}`}
            data-bs-parent='#accordion'
        >
        </div>

    </>        
)
