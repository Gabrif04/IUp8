<script setup>
import { ref } from 'vue'

const props = defineProps([
  'modelValue', 
  'addBtnTitle',
  'cols'
])
const emit = defineEmits(['update:modelValue', 'addElement'])

const searchKey = ref('')
const advSearch = ref(false)
const advSearchQuery = ref(['foo'])

function send() {
  emit('update:modelValue', {
    all: searchKey.value, 
    fields: advSearch.value ? advSearchQuery.value : []
  })
}

</script>

<template>
  <div class="row">
    <div class="col-auto w-75">
      <div class="input-group">
        <input 
          :value="searchKey"
          @input="{ searchKey = $event.target.value; send()}" 
          type="search" class="form-control" placeholder="Filtrar">
        <span class="input-group-text btn-outline-secondary">🔍</span>
        <button type="button" 
          data-bs-toggle="button" 
          class="input-group-text btn btn-outline-secondary b-avanzada"
          @click="{ advSearch = !advSearch; send()}" 
          title="Búsqueda avanzada">⚙️</button>
      </div>
    </div>
    <div class="col-auto">

    </div>
    <div class="col-auto">
      <button type="button" :title="addBtnTitle" 
      @click="$emit('addElement')"
      class="btn btn-outline-primary">➕</button>
    </div>
  </div>
  <div v-if="advSearch" class="row mt-3">
    <div class="col-auto">
      Filtros por campos:
      {{ cols }}
    </div>
  </div>
</template>

<style scoped>
.btn.active.b-avanzada {
  background-color: lightblue;
}
</style>
