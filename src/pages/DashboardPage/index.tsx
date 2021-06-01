import React from 'react'
import { useAppDispatch } from '../../app/hooks'

import './style.scss'
import { resetUser } from '../../features/user/userSlice'

function DashboardPage() {
    const dispatch = useAppDispatch()

    const handleSignOut = () => {
        dispatch(resetUser())
    }

    return (
        <main className={'dashboard'}>
            <header className={'dashboard__header'}>
                <span data-test-id="dashboard-title">Dashboard page</span>
                <div className={'auth-buttons'}>
                    <span
                        className={'auth-buttons__signup'}
                        onClick={handleSignOut}
                    >
                        Sign out
                    </span>
                </div>
            </header>
        </main>
    )
}

export default DashboardPage
