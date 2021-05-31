import userReducer, { UserState, setUser } from './userSlice'

describe('user reducer', () => {
    const initialState: UserState = {
        value: {},
        status: 'idle',
    }
    it('should handle initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' })).toEqual({
            value: {},
            status: 'idle',
        })
    })

    it('should handle setUser', () => {
        const actual = userReducer(
            initialState,
            setUser({ login: 'user', email: 'email@mail.ru', _id: '1' })
        )
        expect(actual.value.login).toEqual('user')
        expect(actual.value.email).toEqual('email@mail.ru')
    })
})
