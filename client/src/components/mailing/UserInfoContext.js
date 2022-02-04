import React, { createContext, useState, useContext } from 'react'
import { useFetch } from '../../hooks/fetch.hook'
import { useAuth } from '../../components/auth/AuthContext'

const UserInfoContext = createContext()

export const useUserInfo = () => {
    return useContext(UserInfoContext)
}

export const UserInfoProvider = ({ children }) => {
    const [email, setEmail] = useState(null)
    const [mailings, setMailings] = useState([])
    const [currentUrl, setCurrentUrl] = useState(null)

    const { token } = useAuth()
    const { request } = useFetch()

    const requestEmail = async () => {
        const { userInfo: { email } } = await request(
            '/user/info',
            'GET',
            null,
            { 'Authorization': `Bearer ${token}` }
        )
    
        setEmail(email)
    }

    const requestMailings = async () => {
        const { activeMailings } = await request(
            '/user/mailings',
            'GET',
            null,
            { 'Authorization': `Bearer ${token}` }
        )
    
        const createdMailings = activeMailings
            .map(mailing => ({ ...mailing, created: true }))
            .sort((mailing, nextMailing) => mailing.id - nextMailing.id)
         
        setMailings(createdMailings)
    }

    const createMailing = () => {
        const uniqueId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

        const newMailing = { id: uniqueId, name: 'New mailing', created: false }
        setMailings([...mailings, newMailing])
    }

    const deleteMailing = id => {
        const newMailings = mailings.filter(mailing => mailing.id !== id)
        setMailings(newMailings)
    }

    const addMailing = async (mailingInfo) => {
        await request(
            '/parse/candidates',
            'POST',
            mailingInfo,
            { 'Authorization': `Bearer ${token}` }
        )
    }

    const updateMailing = async (mailingInfo) => {
        await request(
            '/user/mailing',
            'PATCH',
            mailingInfo,
            { 'Authorization': `Bearer ${token}` }
        )
    }

    return (
        <UserInfoContext.Provider value={{ 
            email, 
            mailings, 
            requestEmail, 
            requestMailings, 
            createMailing,
            addMailing,
            deleteMailing,
            updateMailing,
            currentUrl,
            setCurrentUrl
        }}>
            { children }
        </UserInfoContext.Provider>
    )
}