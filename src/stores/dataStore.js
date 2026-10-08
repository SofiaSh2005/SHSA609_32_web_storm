import { defineStore } from 'pinia'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useDataStore = defineStore('data', {
    state: () => ({
        klient: [],
        klient_total: 0,

        usluga: [],
        usluga_total: 0,

        kosmetolog: [],
        seans: [],

        errorMessage: '',
        errorCode: 0
    }),

    actions: {

        async get_klient(page = 0, perpage = 5, search = '') {
            try {
                const response = await axios.get(`${backendUrl}/klient`, {
                    params: { page, perpage, search }
                })
                this.klient = response.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async get_klient_total(search = '') {
            try {
                const response = await axios.get(`${backendUrl}/klient_total`, {
                    params: { search }
                })
                this.klient_total = response.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async get_klient_by_id(id) {
            try {
                const res = await axios.get(`${backendUrl}/klient/${id}`)
                return res.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async create_klient(formData) {
            this.errorMessage = ''
            this.errorCode = 0

            try {
                const response = await axios.post(
                    `${backendUrl}/klient`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                )

                this.errorCode = response.data.code
                this.errorMessage = response.data.message

                return response.data
            } catch (error) {
                this.handleError(error)
                return null
            }
        },

        async update_klient(id, formData) {
            this.errorMessage = ''
            this.errorCode = 0

            try {
                const response = await axios.post(
                    `${backendUrl}/klient/${id}?_method=PUT`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                )

                this.errorCode = response.data.code
                this.errorMessage = response.data.message

                return response.data
            } catch (error) {
                this.handleError(error)
                return null
            }
        },

        async delete_klient(id) {
            try {
                const response = await axios.delete(
                    `${backendUrl}/klient/${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                );

                return response.data;

            } catch (error) {
                this.handleError(error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    return {
                        success: false,
                        message: "Вы не авторизованы"
                    };
                }

                return {
                    success: false,
                    message: "Ошибка сервера"
                };
            }
        },

        async get_seans() {
            try {
                const res = await axios.get(`${backendUrl}/seans`, {
                    headers: this.authHeaders()
                })
                this.seans = res.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async get_kosmetolog() {
            try {
                const res = await axios.get(`${backendUrl}/kosmetolog`)
                this.kosmetolog = res.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async get_usluga(page = 0, perpage = 5) {
            try {
                const response = await axios.get(`${backendUrl}/usluga`, {
                    params: { page, perpage }
                })
                this.usluga = response.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async get_usluga_total() {
            try {
                const response = await axios.get(`${backendUrl}/usluga_total`)
                this.usluga_total = response.data
            } catch (error) {
                this.handleError(error)
            }
        },

        async create_usluga(formData) {
            this.errorMessage = ''
            this.errorCode = 0

            try {
                const response = await axios.post(`${backendUrl}/usluga`, formData, {
                    headers: {
                        ...this.authHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                })

                return response.data
            } catch (error) {
                this.handleError(error)
                return {
                    code: error.response?.status ?? 2,
                    message: this.errorMessage
                }
            }
        },

        authHeaders() {
            const token = localStorage.getItem('token')
            return token ? { Authorization: `Bearer ${token}` } : {}
        },

        async get_masters_for_service(serviceId) {
            const response = await axios.get(`${backendUrl}/usluga/${serviceId}/masters`)
            return response.data
        },

        async get_bookable_services() {
            const response = await axios.get(`${backendUrl}/bookable-services`)
            return response.data
        },

        async get_available_slots(serviceId, masterId, date) {
            const response = await axios.get(`${backendUrl}/available-slots`, {
                params: { usluga_id: serviceId, kosmetolog_id: masterId, date }
            })
            return response.data
        },

        async create_booking(data) {
            const response = await axios.post(`${backendUrl}/bookings`, data, {
                headers: this.authHeaders()
            })
            return response.data
        },

        async get_my_bookings() {
            const response = await axios.get(`${backendUrl}/my-bookings`, {
                headers: this.authHeaders()
            })
            return response.data
        },

        async get_admin_bookings() {
            const response = await axios.get(`${backendUrl}/admin/bookings`, {
                headers: this.authHeaders()
            })
            return response.data
        },

        async set_booking_status(id, status) {
            const response = await axios.patch(`${backendUrl}/admin/bookings/${id}/status`, { status }, {
                headers: this.authHeaders()
            })
            return response.data
        },

        async create_admin_booking(data) {
            const response = await axios.post(`${backendUrl}/admin/bookings`, data, {
                headers: this.authHeaders()
            })
            return response.data
        },

        async create_master(data) {
            const response = await axios.post(`${backendUrl}/kosmetolog`, data, { headers: this.authHeaders() })
            return response.data
        },

        async delete_master(id) {
            const response = await axios.delete(`${backendUrl}/kosmetolog/${id}`, { headers: this.authHeaders() })
            return response.data
        },

        async delete_service(id) {
            const response = await axios.delete(`${backendUrl}/usluga/${id}`, { headers: this.authHeaders() })
            return response.data
        },

        handleError(error) {
            console.log("API ERROR:", error)

            if (error.response) {
                this.errorCode = error.response.status
                this.errorMessage = error.response.data?.message || 'Ошибка сервера'
            } else {
                this.errorMessage = 'Нет соединения с сервером'
            }
        }
    }
})
