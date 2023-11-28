<script setup>

import VModal from './VModal.vue'
import RangeBox from './RangeBox.vue'
import TextBox from './TextBox.vue'
import IpBox from './IpBox.vue'
import MemberBox from './MemberBox.vue'
import SelectBox from './SelectBox.vue'

import * as M from '../model.js'
import { ref } from 'vue'

const emit = defineEmits(['add', 'edit'])

const props = defineProps({
  vm: Object,
  isAdd: Boolean, // otherwise, editing existing instead of adding
})

let modalRef = ref(null);

function setVm() {
  const vm = props.vm;
  const form = document.getElementById("editOrAddVm")
  const valueFor = (name) => {
    const input = form.querySelector(`input[name=${name}]`)
    if (!input) console.log("ERROR: no input for name", name, "in", form)
    return input.value
  }

  console.log("saving VM...", vm, form)

  // valida IP de forma manual
  for (let i = 0; i < 4; i++) {
    let input = form.querySelector(`input[name=e-ip-${i}]`)
    let o = input.value
    input.setCustomValidity(o >= 0 && o < 255 ? "" : "Expected an integer between 0 and 255")
  }
  const ip = [0, 1, 2, 3].map(n => valueFor(`e-ip-${n}`)).join(".")

  // comprueba validez de todos los campos, y sobreescribe resultado
  if ( ! form.checkValidity()) {
    // fuerza a que se muestren los errores simulando un envío
    // (pero como hay errores, no se va a enviar nada :-)
    form.querySelector("button[type=submit]").click()
    return; 
  }    

  // todo válido: lanza evento a padre, y cierra modal
  emit(props.isAdd ? 'add' : 'edit', new M.Vm(vm.id,
    valueFor("e-name"),
    valueFor("e-ram"), valueFor("e-hdd"),
    valueFor("e-cpu"), valueFor("e-cores"),
    ip,
    valueFor("e-up"), valueFor("e-down"),
    +valueFor("e-iso"), M.VmState.STOPPED, vm.disk, vm.memory, 
    JSON.parse(valueFor("e-groups"))
  ))
  modalRef.value.hide()    
}

// para que el padre pueda llamar a show (hide no debería hacer falta)
function show() {
  modalRef.value.show();
}
defineExpose({ show });
</script>

<template>
  <VModal ref="modalRef" id="vmAddOrEditModal"
    :title="isAdd ? 'Añadiendo VM' : `Editando VM: ${vm.name}`" >
    <template #body>
      <form id="editOrAddVm" 
        @submit.prevent="e => setVm()">
        <div class="container">
          <TextBox :start="vm.name" id="e-name" label="nombre" />
          <MemberBox :start="vm.groups" :all="M.getGroups()" id="e-groups" label="grupos" />
          <br>
          <RangeBox :start="vm.ram" id="e-ram" label="ram" :min="0" :max="128" units="Gb" />
          <RangeBox :start="vm.hd" id="e-hdd" label="hdd" :min="0" :max="4 * 1024" :step="256" units="Gb" />
          <RangeBox :start="vm.cpu" id="e-cpu" label="cpu" :min="0" :max="100" units="%" />
          <RangeBox :start="vm.cores" id="e-cores" label="cores" :min="1" :max="8" units="#" />
          <br>
          <IpBox :start="vm.ip" id="e-ip" label="ip" />
          <RangeBox :start="vm.up" id="e-up" label="up" :min="0" :max="1024 * 20" units="Kbps" />
          <RangeBox :start="vm.down" id="e-down" label="down" :min="0" :max="1024 * 20" units="Kbps" />
          <br>
          <SelectBox :start="vm.iso" :all="M.getFiles()" id="e-iso" label="Fichero ISO" />
        </div>
        <button type="submit" class="invisible">Submit</button>
      </form>
    </template>
    <template #footer>
      <button @click.prevent="() => setVm()" class="btn btn-primary">
        {{ isAdd ? 'Añadir esta VM' : `Confirmar cambios a ${vm.name}` }}
      </button>
    </template>
  </VModal>
</template>

<style scoped>
</style>
