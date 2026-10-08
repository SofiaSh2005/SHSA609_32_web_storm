<template>
  <section>
    <div class="hero-card"><div><p class="eyebrow">BEAUTY CARE</p><h1>{{ isAdmin ? 'Панель администратора' : `Здравствуйте, ${firstName}!` }}</h1><p>{{ isAdmin ? 'Управляйте записями, клиентами, мастерами и услугами в одном месте.' : 'Запишитесь к подходящему мастеру в удобное свободное время.' }}</p><Button :label="isAdmin ? 'Посмотреть записи' : 'Записаться на приём'" :icon="isAdmin ? 'pi pi-calendar' : 'pi pi-calendar-plus'" @click="$router.push(isAdmin ? '/seans' : '/booking')" /></div></div>
    <div class="feature-grid">
      <article v-for="card in cards" :key="card.title" class="feature-card" @click="$router.push(card.route)"><i :class="card.icon"></i><h3>{{ card.title }}</h3><p>{{ card.text }}</p><span>Перейти <i class="pi pi-arrow-right"></i></span></article>
    </div>
  </section>
</template>
<script>
import Button from 'primevue/button'; import { useAuthStore } from '@/stores/authStore'
export default { components:{Button}, data:()=>({auth:useAuthStore()}), computed:{ isAdmin(){return this.auth.user?.role==='admin'}, firstName(){return this.auth.user?.name?.split(' ')[0]||'клиент'}, cards(){return this.isAdmin?[{title:'Записи',text:'Подтверждение и статусы приёмов',icon:'pi pi-calendar',route:'/seans'},{title:'Клиенты',text:'Контакты и клиентская база',icon:'pi pi-users',route:'/klient'},{title:'Мастера',text:'Специалисты и их услуги',icon:'pi pi-user',route:'/kosmetolog'},{title:'Услуги',text:'Стоимость и продолжительность',icon:'pi pi-sparkles',route:'/usluga'}]:[{title:'Новая запись',text:'Выберите услугу, мастера и время',icon:'pi pi-calendar-plus',route:'/booking'},{title:'Мои записи',text:'Будущие и прошедшие посещения',icon:'pi pi-calendar',route:'/my-bookings'},{title:'Мой профиль',text:'Проверьте имя и номер телефона',icon:'pi pi-user',route:'/profile'}] } } }
</script>
