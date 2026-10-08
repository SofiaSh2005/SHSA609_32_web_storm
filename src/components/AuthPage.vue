<template>
  <div class="auth-page">
    <section class="auth-intro"><img src="@/assets/logo.svg" alt="Beauty Care" /><p class="eyebrow">КОСМЕТОЛОГИЧЕСКИЙ САЛОН</p><h1>Красота начинается<br>с заботы о себе</h1><p>Выберите услугу, мастера и удобное свободное время.</p></section>
    <section class="auth-card">
      <div class="auth-tabs"><button :class="{ active: mode === 'login' }" @click="mode='login'">Вход</button><button :class="{ active: mode === 'register' }" @click="mode='register'">Регистрация</button></div>
      <h2>{{ mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт' }}</h2><p class="muted">{{ mode === 'login' ? 'Войдите по номеру телефона' : 'Заполните данные для онлайн-записи' }}</p>
      <form @submit.prevent="submit" class="auth-form">
        <label v-if="mode === 'register'">ФИО<InputText v-model="fio" placeholder="Анна Смирнова" /></label>
        <label>Телефон<InputText v-model="telefon" placeholder="+7 900 000-00-00" /></label>
        <label>Пароль<Password v-model="password" :feedback="false" toggleMask placeholder="Не менее 6 символов" /></label>
        <label v-if="mode === 'register'">Повторите пароль<Password v-model="passwordConfirmation" :feedback="false" toggleMask /></label>
        <Message v-if="error" severity="error" :closable="false">{{ error }}</Message><Button type="submit" :label="mode === 'login' ? 'Войти' : 'Зарегистрироваться'" :loading="loading" />
      </form>
      <div class="demo-hint"><b>Демонстрационные аккаунты</b><span>Администратор: +70000000001 / admin123</span><span>Клиент: +70000000002 / user123</span></div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import InputText from 'primevue/inputtext'; import Password from 'primevue/password'; import Button from 'primevue/button'; import Message from 'primevue/message'
export default {
  components: { InputText, Password, Button, Message },
  data: () => ({ mode: 'login', fio: '', telefon: '', password: '', passwordConfirmation: '', loading: false, auth: useAuthStore() }),
  computed: { error() { return this.auth.errorMessage } },
  methods: { async submit() { this.loading = true; if (this.mode === 'login') await this.auth.login({ telefon: this.telefon, password: this.password }); else await this.auth.register({ fio: this.fio, telefon: this.telefon, password: this.password, password_confirmation: this.passwordConfirmation }); this.loading = false; if (this.auth.isAuthenticated) this.$router.push('/dashboard') } }
}
</script>
