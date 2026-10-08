<template>
  <AuthPage v-if="!isAuthenticated" />
  <div v-else class="app-shell">
    <Menubar :model="items" class="main-menu">
      <template #start><div class="brand"><img src="@/assets/logo.svg" width="54" alt="Beauty Care" /><div><strong>Beauty Care</strong><small>Управление салоном</small></div></div></template>
      <template #item="{ item, props }"><router-link v-if="item.route" :to="item.route" v-bind="props.action"><span :class="item.icon"></span><span>{{ item.label }}</span></router-link></template>
      <template #end><div class="user-box"><span><b>{{ user?.name }}</b><small>{{ isAdmin ? 'Администратор' : 'Клиент' }}</small></span><Button icon="pi pi-sign-out" severity="secondary" text aria-label="Выйти" @click="logout" /></div></template>
    </Menubar>
    <main class="page-container"><router-view /></main>
  </div>
  <Toast /><ConfirmPopup />
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import AuthPage from '@/components/AuthPage.vue'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'

export default {
  components: { AuthPage, Button, Menubar },
  data: () => ({ authStore: useAuthStore() }),
  computed: {
    isAuthenticated() { return this.authStore.isAuthenticated },
    user() { return this.authStore.user },
    isAdmin() { return this.user?.role === 'admin' },
    items() {
      if (this.isAdmin) return [
        { label: 'Обзор', icon: 'pi pi-home', route: '/dashboard' }, { label: 'Записи', icon: 'pi pi-calendar', route: '/seans' },
        { label: 'Клиенты', icon: 'pi pi-users', route: '/klient' }, { label: 'Мастера', icon: 'pi pi-user', route: '/kosmetolog' },
        { label: 'Услуги', icon: 'pi pi-sparkles', route: '/usluga' }
      ]
      return [
        { label: 'Главная', icon: 'pi pi-home', route: '/dashboard' }, { label: 'Записаться', icon: 'pi pi-calendar-plus', route: '/booking' },
        { label: 'Мои записи', icon: 'pi pi-calendar', route: '/my-bookings' }, { label: 'Профиль', icon: 'pi pi-user', route: '/profile' }
      ]
    }
  },
  methods: { async logout() { await this.authStore.logout(); this.$router.push('/') } },
  mounted() { if (this.authStore.token) this.authStore.getUser() }
}
</script>
