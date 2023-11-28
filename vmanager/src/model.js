import * as U from './util.js';

class State {
    /**
     * A full model of the internal state.
     * @param {string} name 
     * @param {[Vm]} vms 
     * @param {[Group]} groups 
     * @param {[File]} files 
     */
    constructor(name, vms, groups, files) {
        this.name = name;
        this.vms = vms;
        this.groups = groups;
        this.files = files;
    }
}

class Vm {
    /**
     * A Virtual Machine.
     * @param {number} id
     * @param {string} name
     * @param {number} ram in Gb
     * @param {number} hd in Gb
     * @param {number} cpu as a percentage
     * @param {number} cores
     * @param {string} ip as a v4 aaa.bbb.ccc.ddd string
     * @param {number} up in Kbps
     * @param {number} down in Kbps
     * @param {number} iso, the id of ISO file in drive, or -1 for none
     * @param {VmState} state ("RUNNING", "STOPPED", or "SUSPENDED")
     * @param {number} disk, the id of a file with disk contents, or -1 for none
     * @param {number} memory, the id of a file with memory contents, or -1 for none
     * @param {[number]} groups, ids of groups for this vm
     */
    constructor(id, name, ram, hd, cpu, cores, ip, up, down, 
            iso, state, disk, memory, groups) {
        this.id = +id;
        this.name = name;
        this.ram = ram;
        this.hd = hd;
        this.cpu = cpu;
        this.cores = cores;
        this.ip = ip;
        this.up = up;
        this.down = down;
        this.iso = iso;
        this.state = state;
        this.disk = disk;
        this.memory = memory;
        this.groups = groups || [];
    }
}

class Group {
    /**
     * Groups VMs and/or groups. Groups may not contain themselves, 
     * either directly or indireclty.
     * @param {number} id
     * @param {string} name
     * @param {[number]} members (ids of contained Vms & Groups)
     */
    constructor(id, name, members) {
        this.id = +id;
        this.name = name;
        this.members = members || [];
    }
}

class File {
    /** 
     * Represents a storage file. Used for OVAs (import/export),
     * disk contents, ram dumps (suspend), and ISOs.
     * @param {number} id 
     * @param {string} name 
     * @param {FileType} type 
     * @param {number} size in bytes
     */
    constructor(id, name, type, size) {
        this.id = +id;
        this.name = name;
        this.type = type;
        this.size = size;
    }
}


/**
 * Possible Vm states.
 */
const VmState = {
    RUNNING: 'funcionando', 
    STOPPED: 'apagada',
    SUSPENDED: 'suspendida', 
}

/**
 * Possible file types
 */
const FileType = {
    ISO: 'iso',
    OVA: 'ova',
    MEMORY: 'memoria',
    DISK: 'disco',
}

class Util {

    /**
     * Genera muchas Vms al azar
     */
    static randomVms(n, startId) {
        const prefixes = new Map();
        return U.fill(n, () => Util.randomVm(startId++, prefixes));
    }

    static randomVm(id, prefixes) {
        const name = U.unique(U.randomChoice(U.lakeNames), prefixes)        
        const G = 1024; // in Mb
        const ram = U.randomInRange(1,128);
        const hd = U.randomInRange(1, 4*G);
        const cpu = U.randomInRange(5, 100);
        const cores = U.randomInRange(1, 6);
        const ip = U.generateIp();
        const up = U.randomInRange(1, 1*G);
        const down = U.randomInRange(1, 1*G);
        const state = U.randomChoice([...Object.values(VmState)]);
        return new Vm(id, name, ram, hd, cpu, cores, ip, up, down, -1, state, -1, -1);
    }

    static randomGroup(id, prefixes) {
        const name = U.unique(U.randomChoice(U.simpsonsNames), prefixes)        
        return new Group(id, name);
    }

    static populate(nVms, nGroups, nFiles) {
        const vms = Util.randomVms(nVms, lastId);
        lastId += nVms;
        const groupsMap = new Map();
        const groups = U.fill(nGroups, () => Util.randomGroup(lastId++, groupsMap));
        for (let g of groups) {
            for (let v of vms) {
                if (Math.random() < .2) {
                    g.members.push(v.id);
                    v.groups.push(g.id);
                }
            }
        }

        const files = [];
        const fileNames = U.randomSample(U.osNames, Math.min(U.osNames.length, nFiles));
        const MB = 1024*1024;
        for (let f of fileNames) {
            files.push(new File(lastId++, f+".iso", FileType.ISO, U.randomInRange(1*MB, 19*MB)));
        }
        return new State("VMs Autogeneradas", vms, groups, files);
    }
}

// cache de IDs
// (se llena vía getId, y se consulta vía resolve, que sí es público; 
//  modificado en métodos de tipo add, rm y set)
let cache = new Map();
// ultimo ID usado (incrementado en métodos de tipo addAlgo)
let lastId = 0;
// el estado global (modificado en métodos de la API tipo add, rm, y set )
let state = new State();

/**
 * Inicializa el estado a uno dado o, si no se especifica, uno generado al azar
 * 
 * @param {State} [newState] 
 */
function init(newState) {
    state = updateState(newState);
    console.log("inicializado!", state);
    return state;
}

/**
 * Devuelve el objeto (User, Course, Edition, ó Result) con esa id
 * @param {number} id a buscar
 * @returns {(User|Course|Edition|Result|undefined)} 
 */
function resolve(id) {
    if (!cache.has(+id)) {
        throw Error("ID not found: " + id);
    }
    return U.clone(cache.get(+id));
}

// acceso y refresco de la cache de IDs
// privado
function getId(id, object, overwrite) {
    const found = cache.has(id);
    if (object) {
        if (found && !overwrite) {
            const old = JSON.stringify(cache.get(+id));
            const cur = JSON.stringify(object);
            throw Error(`duplicate ID ${id}; old '${old}', new '${cur}'`);
        }
        cache.set(+id, object);
    } else {
        if (!found) throw Error("ID not found: " + id);
        return cache.get(+id);
    }
}

// refresca cachés
// privado
function updateState(newState) {
    cache = new Map();
    // si no se especifica un estado, se inventa uno nuevo
    const s = newState || Util.populate(40, 10, 20);
    s.vms.forEach(o => getId(o.id, o));
    s.groups.forEach(o => getId(o.id, o));
    s.files.forEach(o => getId(o.id, o));
    console.log("Updated state", s);
    return s;
}

/**
 * Salva el estado actual, y permite recuperarlo via restoreState
 * @returns {string} token
 */
function saveState() {
    const randomToken = U.randomString(8);

    // add token to stack
    let stack = localStorage.getItem('stack');
    if (!stack) {
        stack = [];
    } else {
        stack = JSON.parse(stack);
    }
    stack.push(randomToken);
    localStorage.setItem('stack', JSON.stringify(stack));
    console.log(`copia guardada ${randomToken}; copias de seguridad existentes`, stack);

    localStorage.setItem(randomToken, JSON.stringify(state));
    return randomToken;
}

/**
 * Restaura un estado previamente guardado
 * @param {string} token 
 */
function restoreState(token) {

    // if no token specified, pop token from stack
    let stack = localStorage.getItem('stack');
    if (!token) {
        if (!stack) {
            stack = [];
        } else {
            stack = JSON.parse(stack);
        }
        if (!stack.length) {
            throw Error("No token specified, and state-stack is empty");
        } else {
            token = stack.pop();
            localStorage.setItem('stack', JSON.stringify(stack));
        }
    }
    console.log(`restaurada: ${token}; copias de seguridad existentes`, stack);

    state = updateState(JSON.parse(localStorage.getItem(token)));
}

/**
 * Devuelve (copias) de vms
 */
function getVms(pattern) {
    const r = pattern ?
        state.vms.filter(o => U.sameAs(o, pattern)) :
        state.vms;
    return U.clone(r);
}

/**
 * Devuelve (copias) de grupos
 */
function getGroups(pattern) {
    const r = pattern ?
        state.groups.filter(o => U.sameAs(o, pattern)) :
        state.groups;
    return U.clone(r);
}

/**
 * Devuelve (copias) de archivos
 */
function getFiles(pattern) {
    const r = pattern ?
        state.files.filter(o => U.sameAs(o, pattern)) :
        state.files;
    return U.clone(r);
}

/**
 * elimina una VM del sistema
 */
function rmVm(vmId) {
    console.log(`removing vm ${vmId}`)
    if (!cache.has(+vmId)) {
        throw Error(`Cannot rm with id ${vmId}: not found`);
    }

    // elimina de vms    
    const removals = U.rmWhere(state.vms, o => o.id == vmId);
    if (removals != 1) {
        throw Error(`Expected 1 removal, but did ${removals}`)
    }

    // elimina menciones en grupos
    for (let g of state.groups) {
        U.rmWhere(g.members, o => o == vmId);
    }

    // regenera cachés: cosas pueden haber sido borradas
    state = updateState(state)
}

/**
 * elimina un grupo del sistema
 */
function rmGroup(groupId) {
    console.log(`removing group ${groupId}`)
    if (!cache.has(+groupId)) {
        throw Error(`Cannot rm group with id ${groupId}: not found`);
    }

    // elimina de grupos
    const removals = U.rmWhere(state.groups, o => o.id == groupId);
    if (removals != 1) {
        throw Error(`Expected 1 removal, but did ${removals}`)
    }

    // elimina menciones en vms
    for (let vm of state.vms) {
        U.rmWhere(vm.groups, o => o == groupId);
    }
    // elimina menciones en grupos
    for (let g of state.groups) {
        U.rmWhere(g.members, o => o == groupId);
    }

    // regenera cachés: cosas pueden haber sido borradas
    state = updateState(state)
}

/**
 * modifica una vm
 */
function setVm(vm) {
    if (!cache.has(vm.id)) {
        throw Error(`Cannot set vm with id ${vm.id}: not found`);
    }
    console.log("reemplazando ", resolve(vm.id), "con", vm);

    const oldGroups = getId(vm.id).groups;
    const dropped = U.inOneButNotAnother(oldGroups, vm.groups);
    const joined = U.inOneButNotAnother(vm.groups, oldGroups);

    // reemplaza en vms
    U.doWhere(state.vms, o => o.id == vm.id, (a, i) => a[i] = vm);

    // actualiza grupos
    for (let g of dropped) {
        U.rmWhere(getId(g).members, o => o == vm.id);
    }
    for (let g of joined) {
        getId(g).members.push(vm.id);
    }

    // reemplaza en cache
    getId(vm.id, vm, true);
}

/**
 * modifica un grupo
 */
function setGroup(g) {
    if (!cache.has(g.id)) {
        throw Error(`Cannot set group with id ${g.id}: not found`);
    }
    console.log("reemplazando ", resolve(g.id), "con", g);

    const oldMembers = getId(g.id).members;
    const dropped = U.inOneButNotAnother(oldMembers, g.members);
    const joined = U.inOneButNotAnother(g.members, oldMembers);

    // reemplaza en groups
    U.doWhere(state.groups, o => o.id == g.id, (a, i) => a[i] = g);

    // actualiza en listas de grupos de vms
    for (let v of dropped) {
        U.rmWhere(getId(v).groups, o => o == g.id);
    }
    for (let v of joined) {
        getId(v).groups.push(g.id);
    }

    // reemplaza en cache
    getId(g.id, g, true);
}

/**
 * añade una vm; ignora el ID para asignarle otro nuevo
 * @param {Vm} vm 
 */
function addVm(vm) {
    console.log("añadiendo ", vm);
    const newVm = new Vm(lastId++, vm.name, +vm.ram, +vm.hd, +vm.cpu, 
        +vm.cores, vm.ip, +vm.up, +vm.down, vm.iso, vm.state, +vm.disk,
        +vm.memory, vm.groups);
    getId(newVm.id, newVm, false);
    state.vms.push(newVm);
    return newVm;
}

/**
 * añade un grupo; ignora el ID para asignarle otro nuevo
 * @param {Group} g 
 */
function addGroup(g) {
    console.log("añadiendo ", g);
    const newGroup = new Group(lastId++, g.name, g.members);
    getId(newGroup.id, newGroup, false);
    state.groups.push(newGroup);
    return newGroup;
}

// cosas que estarán disponibles desde fuera de este módulo
// todo lo que NO se mencione aquí es privado (= inaccesible) desde fuera
// podríamos haber evitado esto añadiendo `export` a todas las funciones "públicas"
export {

    State, // estado de la aplicación; incluye todas las instancias de las siguientes entidades
    // Entidades
    Vm,
    Group,
    File,

    // Enums
    VmState,
    FileType,

    // salva el estado actual (a localStorage; devuelve ID asignado)
    saveState,
    // restaura un estado previamente guardado
    restoreState,

    // NOTA: para añadir o eliminar vms o grupos de grupos, 
    //   usa setGroup y modifica las listas de IDs de members
    //   o usa setVm y modifica las listas de IDs de groups
    getVms,
    getGroups,
    getFiles,
    
    addVm,
    setVm,
    rmVm,
    
    addGroup,
    setGroup,
    rmGroup,
    
    // general
    init, // inicializa el estado; llama para no operar con un modelo vacío
    resolve, // devuelve un objeto, por ID
};