/**
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Este fichero, `js`, contiene funciones que te pueden resultar útiles para 
 * - generar datos de prueba
 * - validar datos
 * - operar con el DOM
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original
 * - no me eches la culpa si algo no funciona como esperas
 *
 * @Author manuel.freire@fdi.ucm.es
 */

export function one(selector) {
    return document.querySelector(selector);
}

export function all(selector) {
    return document.querySelectorAll(selector);
}

export function add(selector, html) {
    one(selector).insertAdjacentHTML("beforeend", html);
}

export function clean(selector) {
    all(selector).forEach(o => o.innerHTML = '')
}

export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const DIGITS = '01234567890';

/**
 * Escapes special characters to prevent XSS/breakage when generating HTML
 * via, say, insertAdjacentHTML or insertHTML.
 * 
 * (see https://stackoverflow.com/a/9756789/15472)
 * 
 * @param {string} s
 */
export function escape(s) {
    return ('' + s) /* Forces the conversion to string. */
        .replace(/\\/g, '\\\\') /* This MUST be the 1st replacement. */
        .replace(/\t/g, '\\t') /* These 2 replacements protect whitespaces. */
        .replace(/\n/g, '\\n')
        .replace(/\u00A0/g, '\\u00A0') /* Useful but not absolutely necessary. */
        .replace(/&/g, '\\x26') /* These 5 replacements protect from HTML/XML. */
        .replace(/'/g, '\\x27')
        .replace(/"/g, '\\x22')
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E');
}

/**
 * Quote attribute values to prevent XSS/breakage
 * 
 * (see https://stackoverflow.com/a/9756789/15472)
 * 
 * @param {string} s
 * @param {boolean|undefined} preserveCR (por defecto false) para permitir `\n`
 */
export function quoteattr(s, preserveCR) {
    preserveCR = preserveCR ? '&#13;' : '\n';
    return ('' + s) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        /*
        You may add other replacements here for HTML only 
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */
        .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
        .replace(/[\r\n]/g, preserveCR);
}

/**
 * Lanza excepción si el parámetro no existe como clave en el objeto pasado como segundo valor
 * @param {string} a
 * @param {*} enumeration, un objeto
 */
export function checkEnum(a, enumeration) {
    const valid = Object.values(enumeration);
    if (a === undefined) {
        return;
    }
    if (valid.indexOf(a) === -1) {
        throw Error(
            "Invalid enum value " + a +
            ", expected one of " + valid.join(", "));
    }
}

/**
 * Genera un entero aleatorio entre min y max, ambos inclusive
 * @param {Number} min 
 * @param {Number} max 
 */
export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Devuelve un carácter al azar de la cadena pasada como argumento
 * @param {string} alphabet 
 */
export function randomChar(alphabet) {
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

/**
 * Devuelve una cadena de longitud `count` extraida del alfabeto pasado como
 * segundo argumento
 * @param {number} count 
 * @param {(string|undefined)} alphabet, por defecto alfanuméricos con mayúsculas y minúsculas
 */
export function randomString(count, alphabet) {
    const n = count || 5;
    const valid = alphabet || UPPER + LOWER + DIGITS;
    return new Array(n).fill('').map(() => this.randomChar(valid)).join('');
}

/**
 * Devuelve un identificador tipo DNI al azar (8 caracteres + letra)
 */
export function generateDni(number) {
    const nr = number ?
        number.padStart(8, '0').substring(0, 8) :
        new Array(8).fill('').map(() => this.randomChar(DIGITS)).join('');
    const pos = nr % 23;
    return "" + nr + "TRWAGMYFPDXBNJZSQVHLCKET".substring(pos, pos + 1);
}

/**
 * Devuelve una dirección IPv4 "válida" (ver isValidIp) al azar
 */
export function generateIp() {
    return [1,2,3,4].map(() => randomInRange(0, 255)).join(".");
}

/**
 * Devuelve true si y sólo si el DNI es válido (8 caracteres + letra)
 */
export function isValidDni(dni) {
    if (!/^[0-9]{8}[A-Z]$/.test(dni)) {
        return false;
    }
    return generateDni(dni.substring(0, 8)) == dni
}

/**
 * Devuelve true si y sólo si la cadena pasada es una IPv4 válida
 * (no comprueba direcciones reservadas o si son enrutables o no...)
 */
export function isValidIp(ip) {
    if (!/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}]$/.test(ip)) {
        return false;
    }
    return ip.split(".").filter(n => n < 256).length == 4;
}


/**
 * Genera una palabra, opcionalmente empezando por mayúsculas
 * 
 * @param {number} count longitud
 * @param {(boolean|undefined)} capitalized, por defecto false; si true, 1er caracter en mayuscula
 */
export function randomWord(count, capitalized) {
    return capitalized ?
        this.randomChar(UPPER) + this.randomString(count - 1, LOWER) :
        this.randomString(count, LOWER);
}

/**
 * Genera palabras al azar, de forma configurable
 * 
 * @param {number} wordCount a generar
 * @param {(boolean|undefined)} allCapitalized si todas deben empezar por mayúsculas (por defecto, sólo 1a)
 * @param {(string|undefined)} delimiter delimitador a usar (por defecto, espacio)
 */
export function randomText(wordCount, allCapitalized, delimiter) {
    let words = [this.randomWord(5, true)]; // primera empieza en mayusculas
    for (let i = 1; i < (wordCount || 1); i++) words.push(this.randomWord(5, allCapitalized));
    return words.join(delimiter || ' ');
}

/**
 * Devuelve algo al azar de un array
 * 
 * @param {[*]} array 
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Genera una fecha al azar entre 2 dadas
 * https://stackoverflow.com/a/19691491
 * 
 * @param {string} fechaIni, en formato válido para `new Date(fechaIni)`
 * @param {number} maxDias 
 */
export function randomDate(fechaIni, maxDias) {
    let dia = new Date(fechaIni);
    dia.setDate(dia.getDate() - randomInRange(1, maxDias));
    return dia;
}

/**
 * Devuelve n elementos no-duplicados de un array
 * de https://stackoverflow.com/a/11935263/15472
 *
 * @param {[*]} array 
 * @param {size} cuántos elegir (<= array.length)
 */
export function randomSample(array, size) {
    var shuffled = array.slice(0),
        i = array.length,
        temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

/**
 * Genera hasta n parejas no-repetidas de elementos de dos arrays
 * los elementos deben ser números, o texto que no contenga el separador
 * 
 * @param {number} count 
 * @param {[(string|number)]} as 
 * @param {[(string|number)]} bs 
 * @param {string|undefined} separator a usar, por defecto `,`
 */
export function randomPairs(count, as, bs, separator) {
    separator = separator || ",";
    const pairs = new Set();
    let retries = 0;
    while (pairs.size < count && retries < 100) {
        let p = `${randomChoice(as)}${separator}${randomChoice(bs)}`;
        if (pairs.has(p)) {
            retries++;
        } else {
            pairs.add(p);
        }
    }
    return Array.from(pairs).map(p => p.split(separator).map(s => +s));
}

/**
 * Llena un array con el resultado de llamar a una funcion varias veces
 * 
 * @param {number} count 
 * @param {Function} f 
 */
export function fill(count, f) {
    // new Array(count).map(f) fails: map only works on existing indices
    return new Array(count).fill().map(f)
}

// from https://gist.github.com/jparrill/6971533
export const lakeNames = [
    "action","enid","marion","sawtooth","alturas","erie","meade","seeley","bantam",
    "fairfax","merritt","seminole","baron","fallriver","michigan","sevuer","beaver",
    "fenton","minnetonkas","shasta","beshear","geneva","mono","sinclair",
    "bluestone","george","navajo","spirit","bluewater","greenbo","okeechobee",
    "storm","burke","greers","ontario","stump","caddo","greeson","ozarks",
    "summer","candlewood","gull","patoka","sunapee","cedar","harding","peck",
    "superior","champlain","harris","perry","sutton","claytor","hartwell",
    "placid","tahoe","como","hauser","pleasant","texoma","cowan","heron",
    "pontchartrain","travis","crater","higgins","powell","trinity","crescent",
    "holt","pyramid","tule","crystal","horsehead","redfish","tupper","cumberland",
    "houghton","rend","tygart","cypress","huron","rico","ute","degray","isabella",
    "rush","verret","delta","kickapoo","sabbatia","walker","donner","kissimmee",
    "sabine","walloon","eagle","leech","sakakawea","wheeler","elk","liberty",
    "salton","wilson","elwell","locust","sardis","zoar","emporia","lurleen",
    "saugatuck"
];

export const simpsonsNames = [
    "lisa","bart","maggie","homer","marge","millhouse","martin","ralph",
    "burns","smithers","barney","grampa","flanders","wiggum","lovejoy",
    "willie","apu","bob","skinner","edna","krusty","nelson","quimby",
    "brockman","apu","riviera","otto","patty","selma","frink"
]

// https://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions
// https://www.debian.org/releases/
// https://en.wikipedia.org/wiki/MacOS_version_history
export const osNames = [
    "Windows 2000",
    "Windows XP",
    "Windows Vista",
    "Windows 7",
    "Windows 8",    
    "Windows 10",    
    "Windows 11",    
    "Debian Lenny",
    "Debian Squeeze",
    "Debian Wheezy",
    "Debian Jessie",
    "Debian Stretch",
    "Debian Buster",
    "Debian Bullseye",
    "Debian Bookworm",
    "MacOS X Jaguar",
    "MacOS X Leopard",
    "MacOS X Mountain Lion",
    "MacOS X Mavericks",
    "MacOS 11 Big Sur",
    "MacOS 13 Ventura",
    "MacOS 14 Sonoma",
]

/**
 * Convierte un valor en único dentro de un conjunto usando un sufijo numérico
 * 
 * @param {string} str a hacer unico mediante un sufijo numérico que se puede incrementar
 * @param {Map<String, number>} prev con los valores previos
 */
export function unique(str, prev) {
    if (!prev.has(str)) {
        prev.set(str, 1);
        return str;
    } else {
        const next = prev.get(str);
        prev.set(str, next + 1);
        return `${str}${next}`;
    }
}

/**
 * Llama a `callback` allá donde se cumpla la condición
 * devuelve el número de callbacks invocados
 * @param {[*]} array 
 * @param {function} condition 
 * @param {function} callback
 */
export function doWhere(array, condition, callback) {
    let counter = 0;
    for (let i = 0; i < array.length; i++) {
        if (condition(array[i])) {
            if (callback) {
                callback(array, i);
                counter ++;
            }
        }
    }
    return counter;
}

/**
 * Elimina el elemento de las posiciones donde se cumple la condición;
 * devuelve el número de eliminaciones totales
 * @param {[*]} array 
 * @param {function} condition 
 */
export function rmWhere(array, condition) {
    return doWhere(array, condition, (a, i) => a.splice(i, 1));
}

/**
 * Returns elements in one array but not in the other
 */
export function inOneButNotAnother(as, bs) {
    return as.filter(a => bs.indexOf(a) == -1);
}

/**
 * Returns a deep clone of a serializable object
 */
export function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

/**
 * Devuelve "true" si el objeto corresponde al patrón (= mismos valores en mismas propiedades)
 * 
 * @param {Object} objeto
 * @param {Object} pattern
 */
export function sameAs(o, pattern) {
    for (let [k, v] of Object.entries(pattern)) {
        if (o[k] !== v) return false;
    }
    return true;
}