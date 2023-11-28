# iu2324

Repositorio para prácticas de IU, edición 2023-24.

Este año implementamos una interfaz de gestión (simulada) de máquinas virtuales, que pueden estar agrupadas.

## Instalación

* Descarga nodejs / npm 

    + en los laboratorios *ya está instalado*, puedes saltarte este paso
    + en tu ordenador con Windows, recomiendo el [instalador oficial](https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi) para Windows 64-bits
    + en tu ordenador con Linux, recomiendo [nvm](https://github.com/nvm-sh/nvm), aunque hay otras alternativas que seguramente funcionen igual de bien

* Descarga los fuentes a una carpeta de trabajo,

    + en los laboratorios, la primera vez
    ~~~{.ps}
    cd \hlocal
    git clone https://github.com/manuel-freire/iu2324
    cd iu2324\vmanager
    ~~~

    + en otros sitios puedes variar la carpeta de destino (`hlocal` seguramente no exista), y si ya habías descargado el proyecto antes, mejor usar lo que ya tenías. 

* Lanza el proyecto (desde dentro de la carpeta `vmanager`)

    ~~~
    npm install
    npm run serve
    ~~~

    **Importante: `vmanager/node_modules`** ocupa mucho, y se regenera cada vez que ejecutas `npm install`, y por tanto **nunca** se debe meter en repositorios.

* Abre un navegador para ver tu página, y un editor para modificarla:

    ~~~
    firefox localhost:8080
    code .
    ~~~

    (puede ser más fácil lanzarlos desde fuera de una consola; el `.` abre la carpeta actual, por lo que deberías estar dentro de `vmanager` al ejecutar `code .` )

* Instala la extensión de VS Code para Vue.js. Para ello, navega a cualquier archivo con extensión `.vue` (por ejemplo, `src/App.vue`), y te aparecerá una ventanita que te ofrece instalar `Volar (1.2.0)` ó superior.

## Contenido del proyecto

Lo importante está en `src/components`. 

Hay 2 ficheros que son librerías de JS puro, y que no tienen dependencias:

* `model.js` - contiene el modelo. En una aplicación web de verdad, esto sería una API que haría peticiones AJAX al servidor para acceder al modelo de verdad, que estaría en una base de datos. Aquí, lo generamos todo en JS...
* `util.js` - funciones sencillas de JS, usadas mucho dentro del modelo.

El otro fichero `.js`, `main.js`, se encarga de instanciar la aplicación web  - y el único cambio con respecto a lo que genera **Vue** es haber incorporado **boostrap**.

El resto de ficheros son de tipo `.vue`, y por tanto componentes-de-único-fichero (SFC, en inglés):

* `App.vue`: el el fichero principal, estructura toda la interfaz y es el único que modifica el estado de la aplicación (proporcionado por `model.js`)

* *Algo*-`Box.vue`: componentes para pintar campos de formulario. Hay varias:

    * `TextBox.vue`: una etiqueta y luego un campo de texto. Para escribir texto.
    * `IpBox.vue`: entrada estructurada de una dirección IPv4.
    * `MemberBox.vue`: elección de elementos de una lista.
    * `RangeBox.vue`: una etiqueta y un número. Incluye una barrita y unidades.
    * `SelectBox.vue`: permite elegir (a lo sumo) 1 elemento de entre varios.

* `VModal.vue` colabora con `VmAddOrEditModal` (para Vms) o `GroupAddOrEditModal` (para grupos), proporcionando diálogos modales para editar o añadir elementos. Usa los componentes de tipo `Box` para los formularios que hay dentro de esos diálogos.

* `VmGrid.vue` colabora con `FilterAddBox` para proporcionar tablas filtrables y ordenables en las que mostrar cualquier tipo de elemento.

* `DetailsPane.vue` proporciona la vista de detalles, tanto para Vms como para grupos, y permite también lanzar las operaciones de editar, borrar, etcétera.

## Nota

Este proyecto es muy mejorable, pero es suficiente para ver cómo funciona Vue, y además se aprende mucho (de Vue, usabilidad y accesibilidad) mejorando código ajeno. ¡Anímate a hacerlo!

