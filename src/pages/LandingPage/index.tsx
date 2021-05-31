import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import './style.scss'

function LandingPage() {
    return (
        <main className={'landing'}>
            <header className={'landing__header'}>
                <span>Landing page</span>
                <div className={'auth-buttons'}>
                    <Link to={'/signin'}>
                        <span className={'auth-buttons__signin'}>Sign In</span>
                    </Link>
                    <Link to={'/signup'}>
                        <span className={'auth-buttons__signup'}>Sign Up</span>
                    </Link>
                </div>
            </header>
        </main>
    )
}

export default LandingPage
