import React from 'react'

import LoginForm from '../../components/forms/LoginForm'
import { authAsync } from '../../features/user/userSlice'
import { useAppDispatch } from '../../app/hooks'
import './style.scss'

function LoginPage() {
    const dispatch = useAppDispatch()

    const handleSubmit = (values: { login: string; password: string }) => {
        dispatch(authAsync(values))
    }

    return (
        <main className={'login-page'}>
            <LoginForm handleSubmit={handleSubmit} />
        </main>
    )
}

export default LoginPage
