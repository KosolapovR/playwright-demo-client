import React from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

import './style.scss'

type Prop = {
    handleSubmit: (values: { login: string; password: string }) => void
}

function LoginForm({ handleSubmit }: Prop) {
    const formik = useFormik({
        initialValues: {
            login: '',
            password: '',
        },
        onSubmit: (values) => {
            handleSubmit(values)
        },
    })
    return (
        <form onSubmit={formik.handleSubmit} className={'login-form'}>
            <div className={'login-form__field'}>
                <label htmlFor="login" className={'field__label'}>
                    Login
                </label>
                <input
                    id="login"
                    name="login"
                    type="text"
                    className={'field__input'}
                    onChange={formik.handleChange}
                    value={formik.values.login}
                />
            </div>

            <div className={'login-form__field'}>
                <label htmlFor="email" className={'field__label'}>
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className={'field__input'}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
            </div>

            <Link to="/signup">
                <span>Not have an account? Register.</span>
            </Link>

            <button type="submit" className={'login-form__button'}>
                Submit
            </button>
        </form>
    )
}

export default LoginForm
