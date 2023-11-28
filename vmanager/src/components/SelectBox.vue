<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: String,
  id: String,
  start: Number,
  all: Array
})

const value = ref(0)
const list = ref([])

onMounted(() => {
  value.value = props.start;
  list.value.push({id: -1, name: '(ningún fichero elegido)', type: null, size: 0});
  list.value.push(...props.all);
})

</script>

<template>
  <div class="row g-1 form-inline align-items-baseline">
    <div class="col-3 text-end">
      <label :for="id" class="form-label">{{ label }}</label>
    </div>
    <div class="col-auto">
      <select @change="e => value=+e.target.value">
        <option v-for="o in list" :key="o.id" :value="o.id" :selected="o.id == value"> 
          {{ o.name }}
        </option>
      </select>
      <input type="hidden" :name="id" :id="id" :value="value">
    </div>
  </div>
</template>

<style scoped></style>
