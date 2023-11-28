<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: String,
  id: String,
  start: Number,
  min: Number,
  max: Number,
  step: { type: Number, default: 1 },
  units: String
})

let value = ref(0)

onMounted(() => {
  value.value = props.start;
})

</script>

<template>
  <div class="row g-1 align-items-center">
      <div class="col-3 text-end">
        <label :for="id" class="form-label">{{ label }}</label>
      </div>
      <div class="col-5">
        <input type="range" class="form-range" :id="id" :name="id" :min="min" :max="max" :step="step" v-model="value">
      </div>
      <div class="col-1">
        <input type="number" size="5" class="form-control-sm" :id="`${id}-v`" :name="`${id}-v`" :min="min" :max="max" v-model="value">
      </div>
      <div class="col-auto text-start">
        <span class="form-text">{{ units }}</span>
      </div>
  </div>
</template>

<style scoped></style>
