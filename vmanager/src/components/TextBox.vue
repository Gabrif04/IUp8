<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: String,
  id: String,
  start: String,
})

let value = ref(0)

onMounted(() => {
  value.value = props.start;
})

</script>

<template>
  <div class="row g-1 form-inline align-items-baseline">
    <div class="col-3 text-end">
      <label :for="id" class="form-label">{{ label }}</label>
    </div>
    <div class="col-auto">
      <input type="text" class="form-control" :name="id" :id="id" v-model="value">
    </div>
  </div>
</template>

<style scoped></style>
