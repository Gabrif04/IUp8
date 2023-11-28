<script setup>
import * as M from './model.js'

import VmGrid from './components/VmGrid.vue'
import FilterAddBox from './components/FilterAddBox.vue'
import VmAddOrEditModal from './components/VmAddOrEditModal.vue'
import GroupAddOrEditModal from './components/GroupAddOrEditModal.vue'
import DetailsPane from './components/DetailsPane.vue'

import { ref, onMounted, nextTick } from 'vue'
import * as bootstrap from 'bootstrap'

// inicializa modelo (si esto fuese de verdad, habría un login previo)
M.init();
// trampas: da acceso al modelo desde la consola
window.M = M

// las partes que nos interesan
const vms = ref(M.getVms());
const groups = ref(M.getGroups());
const selected = ref({id: -1});

// tooltips
onMounted(() => {
  // see https://getbootstrap.com/docs/5.3/components/tooltips/#overview
  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
    .map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

// recarga vistas
function refresh() {
  vms.value = M.getVms();
  groups.value = M.getGroups();
  if (selected.value.id != -1) {
    selected.value = M.resolve(selected.value.id);
  }
}

/////
// Vms
/////

// modal para añadir/editar vms
let vmModalRef = ref(null);
const defaultNewVm = new M.Vm(-1, 'nueva máquina', 4, 100, 50, 1,
        "0.0.0.0", 100, 100, -1, M.VmState.STOPPED, 100, 100, []);
let vmToAddOrEdit = ref(defaultNewVm);


// empieza a editar una Vm; pasa -1 para crear una nueva
async function edVm(id) {
  console.log("now editing", id)
  vmToAddOrEdit.value = (id == -1) ?
    vmToAddOrEdit.value = defaultNewVm :
    vmToAddOrEdit.value = M.resolve(id);
  // da tiempo a Vue para que prepare el componente antes de mostrarlo
  await nextTick()
  vmModalRef.value.show()
}

function rmVm(id) {
  M.rmVm(id);
  if (selected.value.id == id) {
    selected.value = {id: -1};
  }
  refresh();
}

function setState(id, state) {
  const vm = M.resolve(id);
  vm.state = state;
  M.setVm(vm);
  refresh();
}

/////
// Grupos
/////

// modal para añadir/editar grupos
let groupModalRef = ref(null);
const defaultNewGroup = new M.Group(-1, 'nuevo grupo', []);
let groupToAddOrEdit = ref(defaultNewGroup);

// empieza a editar un grupo; pasa -1 para crear uno nuevo
async function edGroup(id) {
  console.log("now editing", id)
  groupToAddOrEdit.value = (id == -1) ?
    groupToAddOrEdit.value = defaultNewGroup :
    groupToAddOrEdit.value = M.resolve(id);
  // da tiempo a Vue para que prepare el componente antes de mostrarlo
  await nextTick()
  groupModalRef.value.show()
}

function rmGroup(id) {
  M.rmGroup(id);
  if (selected.value.id == id) {
    selected.value = {id: -1};
  }
  refresh();
}

/////
// Búsqueda y Filtrado
/////

const searchGroupQuery = ref({all: '', fields: []})
const searchVmQuery = ref({all: '', fields: []})
const debug = false;

const vmFilterGroup = ref(null)
const groupFilterVm = ref(null)

// muestra sólo vms de ese grupo (o todas con -1)
const switchVms = (groupId) => {
  console.log('vms for group ', groupId);
  vms.value = (groupId == -1) ? 
    M.getVms() :
    M.resolve(groupId).members.map(vmId => M.resolve(vmId))
  vmFilterGroup.value = (groupId == -1) ? 
    null :
    M.resolve(groupId)    
}

// muestra sólo grupos con esa vm (o todos con -1)
const switchGroups = (vmId) => {
  console.log('groups for vm ', vmId);
  groups.value = (vmId == -1) ? 
    M.getGroups() :
    M.resolve(vmId).groups.map(groupId => M.resolve(groupId))
  groupFilterVm.value = (vmId == -1) ? 
    null :
    M.resolve(vmId)        
}

</script>

<template>
  <!-- Navbar principal -->
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">VManager</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#div-groups">Grupos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#div-vms">Vms</a>
        </li>
        </ul>        
          <div class="nav-item ms-auto">
            <div class="btn-group">
              <button id="save" class="btn btn-outline-secondary">💾</button>
              <button id="clean" class="btn btn-outline-secondary">🧽</button>
              <button id="restore" class="btn btn-outline-secondary">↩️</button>
            </div>
          </div>
      </div>
    </div>
  </nav>

  <!-- 
    Div principal; container-fluid expande el contenedor para que ocupe todo el espacio disponible 
  -->
  <div class="container-fluid">
    <div class="row">
      <!-- 1a columna: grupos -->
      <div id="div-groups" class="col-md">
        <div>
          <h5 class="d-inline">Grupos
            <span v-if="groupFilterVm" class="filter"
              @click="switchGroups(-1)">
              que contienen a 
              <span class="name">{{ groupFilterVm.name }}×</span>
            </span>            
          </h5>
          <a class="d-inline d-sm-none details" href="#div-details">↘️</a>
        </div>        
        <span v-if="debug"> {{ searchGroupQuery }}</span>        
        <FilterAddBox 
          v-model="searchGroupQuery" 
          :cols="['name', 'members']"
          @add-element="edGroup(-1)"
          addBtnTitle="Añadir nuevo grupo"/>          
        <div class="overflow-y-scroll vh-100">
            <VmGrid :data="groups" :columns="['name', 'members']" :filter-key="searchGroupQuery.all"
            @choose="(e) => { console.log('selected vm', e); selected = M.resolve(e) }">
            </VmGrid>
        </div>
      </div>
      <!-- 2a columna: vms -->
      <div id="div-vms" class="col-md">
        <div>
          <a class="d-inline d-sm-none escape" href="#">⬆️</a>
          <h5 class="d-inline">Máquinas Virtuales 
            <span v-if="vmFilterGroup" class="filter"
              @click="switchVms(-1)">
              dentro de
              <span class="name">{{ vmFilterGroup.name }}×</span>
            </span>            
          </h5>
          <a class="d-inline d-sm-none details" href="#div-details">↘️</a>
        </div>           
        <span v-if="debug"> {{ searchVmQuery }}</span>
        <FilterAddBox 
          v-model="searchVmQuery" 
          :cols="['name', 'ram', 'hd', 'ip']"
          @add-element="edVm(-1)"
          addBtnTitle="Añadir nueva VM"/>
        <div class="overflow-y-scroll vh-100">
          <VmGrid :data="vms" :columns="['name', 'ram', 'groups', 'state']" :filter-key="searchVmQuery.all"
          @choose="(e) => { console.log('selected group', e); selected = M.resolve(e) }">
          </VmGrid>
      </div>
      </div>
      <!-- 3a zona: detalles vms actuales -->
      <div id="div-details" class="col-md">
        <div>
          <a class="d-inline d-sm-none escape" href="#">⬆️</a>
          <h5 class="d-inline">Detalles</h5>
        </div>   
        <div id="details" class="container">
          <DetailsPane 
            :element="selected"
            @editVm="edVm(selected.id)"
            @filterVm="switchGroups(selected.id)"
            @rmVm="rmVm(selected.id)"
            @editGroup="edGroup(selected.id)"
            @filterGroup="switchVms(selected.id)"
            @rmGroup="rmGroup(selected.id)"
            @setState="state=>setState(selected.id, state)"
          ></DetailsPane>
        </div>
      </div>
    </div>
  </div>

  <!-- 
    Modal para crear/editar grupo
    siempre usamos el mismo, y no se muestra hasta que hace falta
  -->
  <GroupAddOrEditModal ref="groupModalRef" 
    :key="groupToAddOrEdit.id"
    :group="groupToAddOrEdit" :isAdd="groupToAddOrEdit.id == -1"
    @add="(g) => { console.log('adding', g); M.addGroup(g); refresh() }"
    @edit="(g) => { console.log('setting', g); M.setGroup(g); refresh() }"
    />

  <!-- 
    Modal para crear/editar VM
    siempre usamos el mismo, y no se muestra hasta que hace falta
  -->
  <VmAddOrEditModal ref="vmModalRef"
    :key="vmToAddOrEdit.id"
    :vm="vmToAddOrEdit" :isAdd="vmToAddOrEdit.id == -1"
    @add="(vm) => { console.log('adding', vm); M.addVm(vm); refresh() }"
    @edit="(vm) => { console.log('setting', vm); M.setVm(vm); refresh() }"
    />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.escape {
  font-size: 150%;
  padding-right: 1em;
}
.details {
  font-size: 150%;
  padding-left: 1em;
}
span.filter>.name {
  font-weight: 1000;
}
span.filter {
  border-bottom: 2px dashed gray;
}
span.filter:hover {
  border-bottom: 2px dashed blue;
}

</style>
