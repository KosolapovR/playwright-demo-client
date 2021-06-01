import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import RegistrationForm from '../index'

describe('Форма регистрации', () => {
    it('Сабмитит корректные данные', async () => {
        const handleSubmit = jest.fn()
        render(<RegistrationForm handleSubmit={handleSubmit} />, {
            wrapper: MemoryRouter,
        })

        userEvent.type(screen.getByLabelText(/login/i), 'Dee John')
        userEvent.type(
            screen.getByLabelText(/email/i),
            'john.dee@someemail.com'
        )
        userEvent.type(screen.getByLabelText(/password/i), '123123')

        userEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({
                email: 'john.dee@someemail.com',
                login: 'Dee John',
                password: '123123',
            })
            expect(handleSubmit).toHaveBeenCalledTimes(1)
        })
    })

    it('При вводе некорректных данных показывает ошибку и дизейблит кнопку', async () => {
        const handleSubmit = jest.fn()

        render(<RegistrationForm handleSubmit={handleSubmit} />, {
            wrapper: MemoryRouter,
        })

        const loginField = screen.getByLabelText(/login/i)
        const emailField = screen.getByLabelText(/email/i)
        const passwordField = screen.getByLabelText(/password/i)

        const submitBtn = screen.getByRole('button', { name: /submit/i })

        userEvent.type(loginField, '')
        userEvent.type(emailField, 'invalidEmail   @mail.com')
        userEvent.type(passwordField, 'as')

        expect(submitBtn).not.toBeDisabled()

        userEvent.click(submitBtn)

        await waitFor(() => {
            expect(submitBtn).toBeDisabled()
        })

        const loginErrorText = await screen.findByText(/обязательное/i)
        const emailErrorText = await screen.findByText(/не коррект/i)
        const passwordErrorText = await screen.findByText(/не менее/i)

        expect(loginErrorText).toBeInTheDocument()
        expect(emailErrorText).toBeInTheDocument()
        expect(passwordErrorText).toBeInTheDocument()

        userEvent.type(loginField, 'correct user name')
        userEvent.type(emailField, 'correct-email@mail.com')
        userEvent.type(passwordField, 'correct-password')

        await waitFor(() => {
            expect(submitBtn).not.toBeDisabled()
        })

        expect(loginErrorText).not.toBeInTheDocument()
        expect(emailErrorText).not.toBeInTheDocument()
        expect(passwordErrorText).not.toBeInTheDocument()
    })
})
