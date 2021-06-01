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

        userEvent.type(screen.getByLabelText(/login/i), '') // обязательное поле
        userEvent.type(screen.getByLabelText(/email/i), 'john.dee.com') // не корректный email
        userEvent.type(screen.getByLabelText(/password/i), '123') // меньше допустимого кол-ва символов

        userEvent.click(screen.getByRole('button', { name: /submit/i }))

        const loginErrorText = await screen.findByText(/обязательное/i)
        const emailErrorText = await screen.findByText(/не коррект/i)
        const passwordErrorText = await screen.findByText(/не менее/i)

        expect(loginErrorText).toBeInTheDocument()
        expect(emailErrorText).toBeInTheDocument()
        expect(passwordErrorText).toBeInTheDocument()
    })
})
