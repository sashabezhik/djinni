import React from 'react'
import { Button, Image, Spinner } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import { useUserInfo } from './UserInfoContext'

import start from '../../images/startBlue.png'
import disabledStart from '../../images/startGrey.png'
import pause from '../../images/pauseBlue.png'
import disabledPause from '../../images/pauseGrey.png'
import deleteBtn from '../../images/delete.png'

export const StatusButtons = ({ 
    mailingInfo: { id, url, status, created },
    loading
}) => {
    const { token } = useAuth()
    const { request } = useFetch()
    const { requestMailings, deleteMailing, currentUrl } = useUserInfo()

    const changeStatusHandler = async (newStatus) => {
        try {
            await request(
                '/user/mailing',
                'POST',
                { 
                    filterUrl: loading ? currentUrl : url, 
                    status: newStatus 
                },
                { Authorization: `Bearer ${token}` }
            )   
    
            await requestMailings()
        } catch (err) {
            await requestMailings()
            console.log(err.message)
        }
    }

    return (
        <div 
            className='mailing-buttons d-flex align-items-center'
        >

            {created && !loading && status !== 'loading' ?
                <>
                    <Button
                        className='mailing-status-btn'
                        onClick={event => {
                            event.stopPropagation()
                            changeStatusHandler('start')
                        }}
                        disabled={status === 'active'}
                    >
                        <Image 
                            src={status === 'active' ? disabledStart : start}                            
                            alt='start'
                            className='mailing-status-btn-img'
                        />
                    </Button>

                    <Button
                        className='mailing-status-btn'
                        onClick={event => {
                            event.stopPropagation()
                            changeStatusHandler('pause')
                        }}
                        disabled={status === 'paused'}
                    >
                        <Image 
                            src={status === 'paused' ? disabledPause : pause}                            
                            alt='pause'
                            className='mailing-status-btn-img'
                        />
                    </Button> 
                </> 
            : null}

            {loading || status === 'loading' ? 
                <div className='d-flex align-items-center px-4'>
                    <Spinner 
                        className='spinner'
                        size='sm'
                        animation='border'
                    />
                </div>
            : null}
            
            <Button
                className='mailing-status-btn'
                onClick={event => {
                    event.stopPropagation()

                    if (created || loading) return changeStatusHandler('delete')

                    deleteMailing(id)
                }}
            >
                <Image 
                    src={deleteBtn}                            
                    alt='delete'
                />
            </Button>

        </div>
    )
}
