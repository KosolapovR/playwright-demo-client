import React from 'react'

import { registerAsync } from '../../features/user/userSlice'
import { useAppDispatch } from '../../app/hooks'
import RegistrationForm from '../../components/forms/RegistrationForm'

import './style.scss'

function RegistrationPage() {
    const dispatch = useAppDispatch()

    const handleSubmit = (values: {
        login: string
        email: string
        password: string
    }) => {
        dispatch(registerAsync(values))
    }

    return (
        <main className={'registration-page'}>
            <RegistrationForm handleSubmit={handleSubmit} />
        </main>
    )
}

export default RegistrationPage
