<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: String,
  id: String,
  start: String,
})

let value = ref([])

onMounted(() => {
  value.value = props.start.split(".")
})

</script>

<template>
  <div class="row g-1  align-items-baseline">
    <div class="col-3 text-end">
      <label :for="id" class="form-label">{{ label }}</label>
    </div>
    <div class="col-auto">
      <div class="input-group">
      <input type="text" class="form-control-sm" size="2" pattern="[012]?[0-9]{1,2}" :id="`${id}-0`" :name="`${id}-0`" v-model="value[0]">
      <div class="input-group-text">.</div>
      <input type="text" class="form-control-sm" size="2" pattern="[012]?[0-9]{1,2}" :id="`${id}-1`" :name="`${id}-1`" v-model="value[1]">
      <div class="input-group-text">.</div>
      <input type="text" class="form-control-sm" size="2" pattern="[012]?[0-9]{1,2}" :id="`${id}-2`" :name="`${id}-2`" v-model="value[2]">
      <div class="input-group-text">.</div>
      <input type="text" class="form-control-sm" size="2" pattern="[012]?[0-9]{1,2}" :id="`${id}-3`" :name="`${id}-3`" v-model="value[3]">
    </div>
    </div>
  </div>
</template>

<style scoped></style>
