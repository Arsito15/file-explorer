# Frontend

Aplicacion React en JavaScript ES6+ que consume `GET /files/data` del API local y muestra la informacion en una tabla con filtro por archivo.

## Requisitos

- Node.js 16
- npm

## Instalacion

```powershell
cd D:\DOCS\Docs\file-explorer\frontend
nvm use 16
npm install
```

## Ejecutar

Primero levanta el backend en otra terminal.

Luego ejecuta el frontend:

```powershell
cd D:\DOCS\Docs\file-explorer\frontend
nvm use 16
npm start
```

La aplicacion queda disponible en:

```text
http://localhost:8080
```

## Docker

Build de la imagen:

```powershell
docker build -t files-frontend .
```

Ejecutar contenedor:

```powershell
docker run --rm -p 8080:80 files-frontend
```

La aplicacion servida por Docker queda disponible en:

```text
http://localhost:8080
```

## Como funciona

- Busca el API local entre los puertos `3001` y `3010`
- Consulta `GET /files/list`
- Consulta `GET /files/data` o `GET /files/data?fileName=...`
- Muestra archivos, cantidad de lineas y la tabla completa
- Permite filtrar visualmente por `file`

## Build de produccion

```powershell
npm run build
```

Compose desde la raiz del proyecto:

```powershell
docker compose up --build
```
