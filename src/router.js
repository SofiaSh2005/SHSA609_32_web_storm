import { createRouter, createWebHistory } from 'vue-router'

import Klient from '@/components/Klient.vue'
import Kosmetolog from '@/components/Kosmetolog.vue'
import Usluga from '@/components/Usluga.vue'
import Seans from '@/components/Seans.vue'
import CreateUsluga from '@/components/CreateUsluga.vue'
import KlientForm from "@/components/KlientForm.vue";
import Dashboard from '@/components/Dashboard.vue'
import Booking from '@/components/Booking.vue'
import MyBookings from '@/components/MyBookings.vue'
import Profile from '@/components/Profile.vue'
import AdminBooking from '@/components/AdminBooking.vue'

const routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/booking', component: Booking },
    { path: '/my-bookings', component: MyBookings },
    { path: '/profile', component: Profile },
    { path: '/admin/booking', component: AdminBooking, meta: { admin: true } },
    { path: '/klient', component: Klient, meta: { admin: true } },
    { path: '/klient/create', component: KlientForm, meta: { admin: true } },
    { path: '/klient/:id', component: KlientForm, meta: { admin: true } },

    { path: '/kosmetolog', component: Kosmetolog, meta: { admin: true } },
    { path: '/usluga', component: Usluga, meta: { admin: true } },
    { path: '/seans', component: Seans, meta: { admin: true } },
    { path: '/createusluga', component: CreateUsluga, meta: { admin: true } },
    { path: '/', redirect: '/dashboard' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    if (to.meta.admin) {
        const user = JSON.parse(localStorage.getItem('salon_user') || 'null')
        if (user?.role !== 'admin') return '/dashboard'
    }
})

export default router
