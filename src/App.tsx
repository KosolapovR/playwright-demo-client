import React, { useEffect } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

import './App.css'
import { selectUser } from './features/user/userSlice'
import { useAppSelector } from './app/hooks'
import DashboardPage from './pages/DashboardPage'
import RegistrationPage from './pages/RegistrationPage'

function App() {
    const user = useAppSelector(selectUser)
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if (user?._id) {
            if (
                location.pathname === '/signin' ||
                location.pathname === '/signup'
            ) {
                history.replace('/dashboard')
            }
        } else {
            if (location.pathname !== '/') {
                history.replace('/')
            }
        }
    }, [user])

    return (
        <>
            <Route exact path="/signin" component={LoginPage} />
            <Route exact path="/signup" component={RegistrationPage} />
            <Route exact path="/landing" component={LandingPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path="/" component={LandingPage} />
        </>
    )
}

export default App
