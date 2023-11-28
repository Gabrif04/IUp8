<script setup>

  import { VmState } from '../model.js'

  defineProps({
    state: String
  })

  const vmStateIcons = {
    [VmState.RUNNING]: "▶",
    [VmState.SUSPENDED]: "💤",
    [VmState.STOPPED]: "🛑"
  };

  const vmStateClasses = {
    [VmState.RUNNING]: "badge rounded-pill text-bg-success",
    [VmState.SUSPENDED]: "badge rounded-pill text-bg-warning opacity-50",
    [VmState.STOPPED]: "fix-stop badge rounded-pill text-bg-danger"
  };  
</script>

<template>
  <span :class="vmStateClasses[state]">{{vmStateIcons[state]}}</span>
</template>

<style scoped>
span { height: 1.8em; width: 2.5em; font-size: 70% }
</style>
