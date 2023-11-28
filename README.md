# iu2324
Repositorio para prácticas de IU, edición 2023-24

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

