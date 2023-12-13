<script setup>
import { ref, computed } from 'vue'
import { VmState, resolve } from '../model.js'

// basado en https://vuejs.org/examples/#grid

const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String
})
defineEmits(['choose'])

const sortKey = ref('')
const sortOrders = ref(
  props.columns.reduce((o, key) => ((o[key] = 1), o), {})
)

/*... EJ4...*/
function generateTooltipContent(machines) {
  // Lógica para generar el contenido del tooltip con los nombres de las máquinas
  const additionalMachines = machines.slice(4);
  const machineNames = additionalMachines.map((value) => resolve(value).name);
  return machineNames.join('\n');
}
/*... EJ4...*/

const filteredData = computed(() => {
  let { data, filterKey } = props
  if (filterKey) {
    filterKey = filterKey.toLowerCase()
    data = data.filter((row) => {
      return Object.keys(row).some((key) => {
        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
      })
    })
  }
  const key = sortKey.value
  if (key) {
    const order = sortOrders.value[key]
    data = data.slice().sort((a, b) => {
      a = a[key]
      b = b[key]
      return (a === b ? 0 : a > b ? 1 : -1) * order
    })
  }
  return data
})

function sortBy(key) {
  sortKey.value = key
  sortOrders.value[key] *= -1
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <table v-if="filteredData.length" class="mitable table">
    <thead>
      <tr>
        <th v-for="key in columns" :key="key" @click="sortBy(key)" :class="{ active: sortKey == key }">
          {{ capitalize(key) }}
          <span v-if="sortKey == key" :class="`arrow ${sortOrders[key] > 0 ? 'asc' : 'dsc'}`"></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData" :key="entry.id" @click="$emit('choose', entry.id)">
        <td v-for="key in columns" :key="`_${entry.id}_${key}`" class="text-start">
          <template v-if="key === 'name'">
            <span class="name">{{ entry[key] }}</span>
          </template>
          <template v-else-if="Array.isArray(entry[key])">
            <div>
              <!-- ... EJ3  y EJ2... -->
              <span v-for="(value, index) in entry[key].slice(0,4)" :key="index" class="badge bg-primary me-1">
                {{ resolve(value).name }}
              </span>
              <!-- ... EJ4... -->
              <span v-if="entry[key].length > 4" :title=generateTooltipContent(entry[key]) class="badge">
                +{{ entry[key].length - 4 }}
              </span>
              <!-- ... EJ3 y EJ2 ... -->

              <!-- ... EJ8 ... -->
              <span v-if="entry[key].length == 0" class="badge">
                {{"None"}}
              </span>
            <!-- ... EJ8 ... -->
            </div>
          </template>


             <!-- ... EJ8 ... -->         
          <template v-else-if="key==='state'">       
              <span v-if="entry[key]==VmState.RUNNING" class="badge_running">{{"Funcionando"}}
              </span>
              <span v-if="entry[key]==VmState.SUSPENDED" class="badge_suspended">{{"Suspendida"}}
              </span>
              <span v-if="entry[key]==VmState.STOPPED" class="badge_stopped">{{"Apagada"}}
              </span>
          </template>
            <!-- ... EJ8 ... -->
          <template v-else>
            {{ entry[key] }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>(no hay nada que mostrar)</p>
</template>

<style>

.mitable td, .mitable th{

  background-color: #04172c;

  color: #ffffff;
}

.arrow.asc::after {
  content: "↓";
}
.arrow.dsc::after {
  content: "↑";
}
span.name {
  font-weight: 1000;
}
table {
  margin-top: 10px;
}
thead>tr {
  border-bottom: 1px solid gray;
  color: rgb(104, 103, 103);
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
}

.badge {
  background-color: #ffffff;  
  color: #090000;  
  font-size: 12px;  
  padding: 5px 8px; 
  margin-bottom: 5px;  
}

/*ej8*/  
.badge_running {
  background-color: #0e8d00;  
  color: #ffffff;  
  font-size: 12px;  
  padding: 5px 8px;  
  margin-bottom: 5px;  
}
.badge_stopped {
  background-color: #f90202;  
  color: #ffffff;  
  font-size: 12px;  
  padding: 5px 8px;  
  margin-bottom: 5px;  
}
.badge_suspended {
  background-color: #ed9a00;  
  color: #ffffff;  
  font-size: 12px;  
  padding: 5px 8px;  
  margin-bottom: 5px;  
}

.badge.bg-primary.me-1 {
  margin-bottom: 5px;

  color: #ffffff;  
}
/*ej8*/  
</style>
