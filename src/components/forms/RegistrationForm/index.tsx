import React from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import './style.scss'

const SignupSchema = Yup.object().shape({
    login: Yup.string()
        .min(4, 'Не менее 4 символов!')
        .max(30, 'Не более 30 символов!')
        .required('Обязательное поле'),
    password: Yup.string()
        .min(4, 'Не менее 4 символов!')
        .max(30, 'Не более 30 символов!')
        .required('Обязательное поле'),
    email: Yup.string()
        .email('Не корректный email')
        .required('Обязательное поле'),
})

type Prop = {
    handleSubmit: (values: {
        login: string
        email: string
        password: string
    }) => void
}

function RegistrationForm({ handleSubmit: externalHandleSubmit }: Prop) {
    const {
        handleSubmit,
        handleChange,
        errors,
        touched,
        values,
        isValid,
        isSubmitting,
    } = useFormik({
        initialValues: {
            login: '',
            email: '',
            password: '',
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            externalHandleSubmit(values)
        },
        validationSchema: SignupSchema,
    })
    return (
        <form onSubmit={handleSubmit} className={'registration-form'}>
            <div className={'registration-form__field'}>
                <label htmlFor="login" className={'field__label'}>
                    login
                </label>
                <input
                    id="login"
                    name="login"
                    type="text"
                    className={'field__input'}
                    onChange={handleChange}
                    value={values.login}
                />
                {errors.login && touched.login && <div>{errors.login}</div>}
            </div>
            <div className={'registration-form__field'}>
                <label htmlFor="email" className={'field__label'}>
                    email
                </label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    className={'field__input'}
                    onChange={handleChange}
                    value={values.email}
                />
                {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div className={'registration-form__field'}>
                <label htmlFor="password" className={'field__label'}>
                    password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className={'field__input'}
                    onChange={handleChange}
                    value={values.password}
                />
                {errors.password && touched.password && (
                    <div>{errors.password}</div>
                )}
            </div>

            <Link to="/signin">
                <span>Already have account? Sign in.</span>
            </Link>

            {Object.keys(errors).length > 0 &&
            Object.keys(touched).length > 0 ? (
                <button
                    type="submit"
                    className={'registration-form__button'}
                    disabled={true}
                >
                    Submit
                </button>
            ) : (
                <button
                    type="submit"
                    className={'registration-form__button'}
                    disabled={false}
                >
                    Submit
                </button>
            )}
        </form>
    )
}

export default RegistrationForm
