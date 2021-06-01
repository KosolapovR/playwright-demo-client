export const API = {
    getAuthUrl: () => 'http://localhost:8080/auth',
    getUserUrl: (id: string = '') => `http://localhost:8080/user/${id}`,
}
