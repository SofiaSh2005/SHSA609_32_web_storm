<template>
  <div class="p-4">

    <h2 class="mb-4">
      {{ isEdit ? 'Редактирование клиента' : 'Создание аккаунта клиента' }}
    </h2>

    <p v-if="!isEdit" class="muted mb-4">Передайте клиенту телефон и временный пароль — по ним он сможет войти и увидеть свои записи.</p>

    <form @submit.prevent="saveKlient" class="flex gap-2">

      <InputText v-model="form.fio" placeholder="ФИО" />
      <InputText v-model="form.telefon" placeholder="Телефон" />
      <Password v-if="!isEdit" v-model="form.password" :feedback="false" toggleMask placeholder="Временный пароль" />

      <Button
          type="submit"
          :label="isEdit ? 'Обновить' : 'Создать аккаунт'"
      />

    </form>

  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";

import { useDataStore } from "@/stores/dataStore";

export default {
  name: "KlientForm",

  components: {
    InputText,
    Button,
    Password
  },

  data() {
    return {
      dataStore: useDataStore(),
      toast: useToast(),

      form: {
        fio: "",
        telefon: "",
        password: ""
      }
    };
  },

  computed: {
    isEdit() {
      return !!this.$route.params.id;
    },

    klientId() {
      return this.$route.params.id;
    }
  },

  async mounted() {
    if (this.isEdit) {
      await this.loadKlient();
    }
  },

  methods: {

    async loadKlient() {
      const klient = await this.dataStore.get_klient_by_id(this.klientId);

      this.form.fio = klient.fio;
      this.form.telefon = klient.telefon;
    },

    async saveKlient() {
      const fd = new FormData();
      fd.append("fio", this.form.fio);
      fd.append("telefon", this.form.telefon);
      if (!this.isEdit) fd.append("password", this.form.password);

      let res;

      if (this.isEdit) {
        res = await this.dataStore.update_klient(this.klientId, fd);
      } else {
        res = await this.dataStore.create_klient(fd);
      }

      if (!res) {
        this.toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: "Вы не авторизованы",
          life: 3000
        });
        return;
      }

      if (res.code === 0) {
        this.toast.add({
          severity: "success",
          summary: "Успешно",
          detail: this.isEdit ? "Клиент обновлён" : "Клиент создан",
          life: 3000
        });

        setTimeout(() => {
          this.$router.push("/klient");
        }, 1000);

      } else {
        this.toast.add({
          severity: "error",
          summary: "Ошибка",
          detail: res.message || "Ошибка операции",
          life: 4000
        });
      }
    }
  }
};
</script>
