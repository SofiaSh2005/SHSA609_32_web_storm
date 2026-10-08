<template>
  <div class="p-4">


    <div v-if="isAuthenticated" class="mb-3">
      <Button
          label="Создать аккаунт клиента"
          icon="pi pi-plus"
          @click="$router.push('/klient/create')"
      />
    </div>


    <div class="flex gap-2 mb-3">
      <InputText
          v-model="search"
          type="text"
          placeholder="Введите ФИО"
      />

      <Button
          type="button"
          @click="onPushSearchButton"
          icon="pi pi-search"
          label="Найти"
      />
    </div>


    <DataTable
        :value="klient"
        :lazy="true"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[2, 5, 10]"
        :totalRecords="klient_total"
        @page="onPageChange"
        :first="offset"
    >
      <Column field="id" header="ID" />
      <Column field="fio" header="ФИО" />
      <Column field="telefon" header="Телефон" />

      <Column v-if="isAuthenticated" header="Действия">
        <template #body="{ data }">
          <div class="flex gap-2">


            <Button
                icon="pi pi-times-circle"
                severity="secondary"
                rounded
                @click="openPopupConfirm($event, data)"
            />


            <Button
                icon="pi pi-calendar-plus"
                severity="success"
                rounded
                aria-label="Записать клиента"
                @click="$router.push(`/admin/booking?client=${data.id}`)"
            />

            <Button
                icon="pi pi-file-edit"
                severity="secondary"
                rounded
                @click="$router.push(`/klient/${data.id}`)"
            />

          </div>
        </template>
      </Column>

    </DataTable>

  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import { useDataStore } from "@/stores/dataStore";
import { useAuthStore } from "@/stores/authStore";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

export default {
  name: "Klient",

  components: {
    DataTable,
    Column,
    Button,
    InputText
  },

  data() {
    return {
      dataStore: useDataStore(),
      authStore: useAuthStore(),
      confirm: useConfirm(),
      toast: useToast(),

      perpage: 5,
      offset: 0,
      search: ""
    };
  },

  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },

    klient() {
      return this.dataStore.klient;
    },

    klient_total() {
      return this.dataStore.klient_total;
    }
  },

  mounted() {
    this.dataStore.get_klient(0, this.perpage);
    this.dataStore.get_klient_total();
  },

  methods: {

    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;

      const page = this.offset / this.perpage;
      this.dataStore.get_klient(page, this.perpage, this.search);
    },

    onPushSearchButton() {
      this.offset = 0;
      this.dataStore.get_klient_total(this.search);
      this.dataStore.get_klient(0, this.perpage, this.search);
    },

    openPopupConfirm(event, data) {
      this.$confirm.require({
        target: event.currentTarget,
        message: `Вы уверены что хотите удалить ${data.id}?`,

        accept: async () => {
          const res = await this.dataStore.delete_klient(data.id);

          if (res?.success === true) {
            this.toast.add({
              severity: "success",
              summary: "Удалено",
              detail: "Клиент удалён",
              life: 3000
            });

            this.offset = 0;
            this.dataStore.get_klient(0, this.perpage, this.search);
            this.dataStore.get_klient_total(this.search);
          } else {
            this.toast.add({
              severity: "error",
              summary: "Ошибка",
              detail: res?.message || "Нельзя удалить клиента у которого назначен сеанс",
              life: 4000
            });
          }
        }
      });
    }
  }
};
</script>
