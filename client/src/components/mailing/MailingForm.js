import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { useUserInfo } from './UserInfoContext'

export const MailingForm = ({ 
    mailing: { name: mailingName = '', url = '', message: mailingMessage = '', created },
    loading,
    setLoading
 }) => {
    const [btnEnabled, setBtnEnabled] = useState(false)
    
    const [nameValue, setNameValue] = useState(mailingName)
    const [urlValue, setUrlValue] = useState(url)
    const [messageValue, setMessageValue] = useState(mailingMessage)

    const name = useRef()
    const filterUrl = useRef()
    const message = useRef()
    
    const { addMailing, requestMailings, updateMailing, setCurrentUrl } = useUserInfo()

    useEffect(() => {
        if (created && !loading) {
            const enabled = 
                nameValue !== mailingName || urlValue !== url || messageValue !== mailingMessage
                
            setBtnEnabled(enabled)
        }
    }, [nameValue, urlValue, messageValue])   

    const handleSubmit = async (event) => {
        try {
            event.preventDefault()

            setCurrentUrl(urlValue)

            setLoading(true)

            const mailingInfo = { 
                name: name.current.value, 
                filterUrl: filterUrl.current.value, 
                message: message.current.value 
            }

            if (created) {
                setBtnEnabled(false)
                await updateMailing({...mailingInfo, oldFilterUrl: url})
            } else {
                await addMailing(mailingInfo)
            }

            setLoading(false)

            await requestMailings()
        } catch (err) {
            if (created) {
                setBtnEnabled(false)
                name.current.value = mailingName
                filterUrl.current.value = url
                message.current.value = mailingMessage
            }
            
            await requestMailings()
            console.log(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='name'
                    className='mb-2'
                >
                    Name:
                </label>
                <input 
                    type='text'  
                    id='name' 
                    ref={name}
                    defaultValue={mailingName} 
                    disabled={loading}
                    className='form-control mailing-input mailing-text lato'
                    onChange={created ? e => setNameValue(e.target.value) : null}
                    required
                />
            </div>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='url'
                    className='mb-2'
                >
                    Link:
                </label>
                <input 
                    type='text'  
                    id='url' 
                    ref={filterUrl}
                    defaultValue={url} 
                    disabled={loading}
                    className='form-control mailing-input mailing-text lato'
                    onChange={e => setUrlValue(e.target.value)}
                    required
                />
            </div>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='message' 
                    className='mb-2'
                >
                    Text of the letter:
                </label>
                <textarea 
                    id='message'
                    rows='5'
                    ref={message}
                    defaultValue={mailingMessage}
                    disabled={loading}
                    className='form-control mailing-input mailing-text lato'
                    onChange={created ? e => setMessageValue(e.target.value) : null}
                    minLength={250}
                    required
                ></textarea>
            </div>

            {created ? 

                (btnEnabled ? 
                    
                    <div className='d-flex justify-content-end'>

                        <Button 
                            type='submit'
                            className='lato mailing-save-btn ml-auto'
                        >
                            Save
                        </Button>

                    </div> 

                : null) 

            : 
                (!loading ?

                    <div className='d-flex justify-content-end'>

                        <Button 
                            type='submit'
                            className='lato mailing-save-btn ml-auto'
                        >
                            Save
                        </Button>

                    </div>

                : null)
            }
            
        </form>
    )
}