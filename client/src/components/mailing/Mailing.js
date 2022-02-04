import React, { useState } from 'react'
import { MailingHeader } from './MailingHeader'
import { MailingBody } from './MailingBody'

export const Mailing = ({ index, mailingInfo }) => {
    const [loading, setLoading] = useState(false)

    return (
        <div className='accordion-item'>

            <MailingHeader 
                idx={index} 
                mailing={mailingInfo} 
                loading={loading}
            />

            <MailingBody 
                idx={index} 
                mailing={mailingInfo} 
                loading={loading}
                setLoading={setLoading}
            />
    
        </div>
    )
}

