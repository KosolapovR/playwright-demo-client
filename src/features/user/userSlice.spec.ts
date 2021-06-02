import userReducer, {
    UserState,
    setUser,
    resetUser,
    authAsync,
} from './userSlice'

function setupFetchStub(data: object): any {
    return function fetchStub() {
        return new Promise((resolve) => {
            resolve({
                json: () => Promise.resolve(data),
            })
        })
    }
}

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

    it('should handle resetUser', () => {
        const prev = userReducer(
            initialState,
            setUser({ login: 'user', email: 'email@mail.ru', _id: '1' })
        )
        expect(prev.value.login).toEqual('user')
        expect(prev.value.email).toEqual('email@mail.ru')

        const actual = userReducer(initialState, resetUser())
        expect(actual.value).toEqual({})
    })

    it('auth asynchronous set user to state', async () => {
        const userData = {
            error: false,
            data: {
                _id: '1',
                email: 'email@mail.ru',
                login: 'login',
            },
        }

        jest.spyOn(global, 'fetch').mockImplementation(setupFetchStub(userData))

        const dispatch = jest.fn()
        const getState = jest.fn()

        const arg = { login: 'login', password: 'yeetmageet123' }

        const action = await authAsync(arg)(dispatch, getState, undefined)

        const actual = userReducer(initialState, action)

        expect(actual.value.login).toEqual('login')
        expect(actual.value.email).toEqual('email@mail.ru')
    })
})
