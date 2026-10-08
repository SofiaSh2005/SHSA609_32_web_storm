import { defineStore } from 'pinia'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('salon_user') || 'null'),
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        errorMessage: '',
        errorCode: 0
    }),

    actions: {
        async login(credentials) {
            this.errorMessage = ""

            try {
                const response = await axios.post(
                    backendUrl + '/login',
                    credentials
                )

                this.user = response.data.user
                this.token = response.data.token
                this.isAuthenticated = true

                localStorage.setItem('token', response.data.token)
                localStorage.setItem('salon_user', JSON.stringify(response.data.user))

            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                } else {
                    this.errorMessage = error.message
                }

                console.log(error)
            }
        },

        async register(data) {
            this.errorMessage = ''
            try {
                const response = await axios.post(backendUrl + '/register', data)
                this.user = response.data.user
                this.token = response.data.token
                this.isAuthenticated = true
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('salon_user', JSON.stringify(response.data.user))
                return true
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Не удалось зарегистрироваться'
                return false
            }
        },

        async updateProfile(data) {
            try {
                const response = await axios.put(backendUrl + '/profile', data, {
                    headers: { Authorization: 'Bearer ' + this.token }
                })
                this.user = response.data
                localStorage.setItem('salon_user', JSON.stringify(response.data))
                return true
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Не удалось сохранить профиль'
                return false
            }
        },

        async getUser() {
            this.errorMessage = ""

            try {
                const response = await axios.get(
                    backendUrl + '/user',
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.token
                        }
                    }
                )

                this.user = response.data
                localStorage.setItem('salon_user', JSON.stringify(response.data))
                this.isAuthenticated = true

            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message
                } else {
                    this.errorMessage = error.message
                }

                console.log(error)
                this.token = null
                this.user = null
                this.isAuthenticated = false
                localStorage.removeItem('token')
                localStorage.removeItem('salon_user')
            }
        },

        async logout() {
            try {
                const response = await axios.get(
                    backendUrl + '/logout',
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.token
                        }
                    }
                )

                this.errorCode = response.data.code
                this.errorMessage = response.data.message
                this.token = null
                this.user = null
                this.isAuthenticated = false

                localStorage.removeItem('token')
                localStorage.removeItem('salon_user')

            } catch (error) {
                if (error.response) {
                    this.errorCode = 1
                    this.errorMessage = error.response.data.message
                } else if (error.request) {
                    this.errorCode = 2
                    this.errorMessage = error.message
                } else {
                    this.errorCode = 3
                }

                console.log(error)
            }
        }
    }
})
