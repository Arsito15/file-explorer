# Files API

API REST en Node.js + Express que consulta la API externa de archivos, descarga los CSV de la seccion `Secret`, filtra lineas invalidas y expone la informacion como JSON en `GET /files/data`.

## Requisitos

- Node.js 14
- npm

Si usas `nvm` en Windows:

```powershell
nvm use 14
```

## Instalacion

Ubicate dentro de la carpeta `api`:

```powershell
cd D:\DOCS\Docs\file-explorer\api
```

Instala dependencias locales:

```powershell
npm install
```

## Levantar el servidor

```powershell
npm start
```

## Docker

Build de la imagen:

```powershell
docker build -t files-api .
```

Ejecutar contenedor:

```powershell
docker run --rm -p 3001:3001 files-api
```

El servidor intenta arrancar primero en `3001`.
Si ese puerto esta ocupado, prueba automaticamente con `3002`, `3003`, `3004`, etc.

Ejemplo de salida:

```text
Server listening on port 3003
```

## Probar el endpoint

Con PowerShell:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3003/files/data" -Headers @{ accept = "application/json" }
```

Con `curl.exe` real:

```powershell
curl.exe -X GET "http://localhost:3003/files/data" -H "accept: application/json"
```

Si el servidor arranco en otro puerto, reemplaza `3003` por el puerto mostrado en consola.

## Respuesta esperada

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

## Ejecutar tests

```powershell
npm test
```

Los tests usan solo:

- Mocha
- Chai
- modulos nativos de Node.js

## Comandos utiles

Instalar y arrancar:

```powershell
cd D:\DOCS\Docs\file-explorer\api
npm install
npm start
```

Ejecutar tests:

```powershell
cd D:\DOCS\Docs\file-explorer\api
npm test
```

Compose desde la raiz del proyecto:

```powershell
docker compose up --build
```
