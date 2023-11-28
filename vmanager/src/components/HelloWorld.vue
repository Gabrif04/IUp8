<script setup>
  defineProps({
    msg: String
  })
</script>

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>  
</template>

<style scoped>
div { border: 1px dashed grey; }
</style>
