<template>
  <div class="p-4">

    <Button
        v-if="isAuthenticated"
        label="Добавить услугу"
        icon="pi pi-plus"
        class="mb-3"
        @click="$router.push('/createusluga')"
    />

    <DataTable
        :value="usluga"
        :lazy="true"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[2, 5, 10]"
        :totalRecords="usluga_total"
        @page="onPageChange"
        :first="offset"
    >

      <Column field="id" header="ID" />
      <Column field="nazvanie" header="Название услуги" />
      <Column field="stoimost" header="Стоимость" />
      <Column header="Длительность"><template #body="{ data }">{{ data.prodolzhitelnost }} мин.</template></Column>


      <Column header="Фото">
        <template #body="slotProps">
          <img
              v-if="slotProps.data.image"
              :src="slotProps.data.image"
              style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
          />
        </template>
      </Column>

    </DataTable>

  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: "Usluga",

  components: {
    DataTable,
    Column,
    Button
  },

  data() {
    return {
      dataStore: useDataStore(),
      authStore: useAuthStore(),
      perpage: 5,
      offset: 0
    };
  },

  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },

    usluga() {
      return this.dataStore.usluga;
    },

    usluga_total() {
      return this.dataStore.usluga_total;
    }
  },

  mounted() {
    this.dataStore.get_usluga(0, this.perpage);
    this.dataStore.get_usluga_total();
  },

  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;

      const page = this.offset / this.perpage;
      this.dataStore.get_usluga(page, this.perpage);
    }
  }
};
</script>

<style scoped>
</style>
