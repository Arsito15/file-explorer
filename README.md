# File Explorer

Proyecto con dos aplicaciones:

- `api`: API REST en Node.js + Express
- `frontend`: cliente React que consume la API local

## Vista Previa

![Vista previa del programa](assets/preview.jpeg)

## Correr con Docker Compose

Desde la raiz del proyecto:

```powershell
docker compose up --build
```

## Correr con Makefile

Tambien puedes usar comandos mas cortos desde la raiz del proyecto:

```powershell
make up
```

Comandos disponibles:

- `make up`: construye y levanta las apps
- `make down`: baja los contenedores
- `make build`: construye las imagenes
- `make rebuild`: reconstruye sin cache
- `make logs`: muestra logs en vivo
- `make ps`: muestra los servicios
- `make restart`: reinicia el stack
- `make clean`: baja contenedores y elimina volumenes
- `make test`: corre tests de api y frontend


Servicios publicados:

- Frontend: `http://localhost:8080`
- API: `http://localhost:3001`

Endpoints utiles:

- `GET http://localhost:3001/files/list`
- `GET http://localhost:3001/files/data`
- `GET http://localhost:3001/files/data?fileName=file1.csv`

Para detener los contenedores:

```powershell
docker compose down
```
