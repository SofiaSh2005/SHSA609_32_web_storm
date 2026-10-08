<template>
  <div class="flex justify-center">
    <form @submit.prevent="createUsluga" class="w-1/2 p-6">

      <h2 class="text-2xl mb-4 text-center" style="color: dimgray">
        Добавление услуги
      </h2>


      <div class="flex flex-col">
        <InputText
            type="text"
            placeholder="Введите название услуги"
            v-model="uslugaName"
        />
      </div>


      <div class="flex flex-col mt-4">
        <InputText
            type="number"
            placeholder="Введите стоимость"
            v-model="stoimost"
        />
      </div>

      <div class="flex flex-col mt-4">
        <InputText type="number" placeholder="Продолжительность в минутах" v-model="prodolzhitelnost" />
      </div>


      <div class="mb-4 mt-4">
        <label
            for="file"
            class="block text-md font-medium text-gray-500 border border-gray-300 rounded-md p-2 cursor-pointer"
        >
          <span class="pi pi-upload mx-3"></span>
          Выбрать изображение
        </label>

        <input
            type="file"
            id="file"
            hidden
            @change="changeCaption"
            accept="image/*"
        />
      </div>

      <div class="flex flex-col mt-6">
        <Button type="submit" label="Создать"/>
      </div>

    </form>
  </div>

</template>

<script>
import InputText from "primevue/inputtext"
import Button from "primevue/button"

import { useDataStore } from "@/stores/dataStore.js"


export default {
  components: {
    InputText,
    Button
  },

  data() {
    return {
      uslugaName: "",
      stoimost: "",
      prodolzhitelnost: 60,
      file: null
    }
  },

  methods: {
    changeCaption(event) {
      this.file = event.target.files[0]
    },

    async createUsluga() {
      const store = useDataStore()

      const formData = new FormData()
      formData.append("nazvanie", this.uslugaName)
      formData.append("stoimost", this.stoimost)
      formData.append("prodolzhitelnost", this.prodolzhitelnost)
      if (this.file) formData.append("image", this.file)

      try {
        const res = await store.create_usluga(formData)

        console.log("BACKEND RESPONSE:", res)


        if (res && res.code === 0) {
          this.$toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: res.message || 'Услуга добавлена',
            life: 3000
          })


          await store.get_usluga(0, 5)

        } else if (res && res.code === 422) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Ошибка валидации',
            detail: res.message || store.errorMessage,
            life: 4000
          })

        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: res?.message || store.errorMessage || 'Неизвестная ошибка',
            life: 4000
          })
        }


        if (res?.code === 0) {
          this.uslugaName = ''
          this.stoimost = ''
          this.file = null
        }

      } catch (e) {
        console.log("CRITICAL ERROR:", e)

        this.$toast.add({
          severity: 'error',
          summary: 'Ошибка запроса',
          detail: 'Backend не отвечает или ошибка сети',
          life: 4000
        })
      }
    }
  }
}
</script>
