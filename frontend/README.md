# Frontend

React application written in ES6+ JavaScript that consumes the local API and displays the returned data in a table with file filtering.

## Requirements

- Node.js 16
- npm

## Installation

```powershell
cd D:\DOCS\Docs\file-explorer\frontend
nvm use 16
npm install
```

## Run

First start the backend in another terminal.

Then start the frontend:

```powershell
cd D:\DOCS\Docs\file-explorer\frontend
nvm use 16
npm start
```

The application will be available at:

```text
http://localhost:8080
```

## Docker

Build the image:

```powershell
docker build -t files-frontend .
```

Run the container:

```powershell
docker run --rm -p 8080:80 files-frontend
```

The Docker-served application will be available at:

```text
http://localhost:8080
```

## How It Works

- It looks for the local API between ports `3001` and `3010`
- It calls `GET /files/list`
- It calls `GET /files/data` or `GET /files/data?fileName=...`
- It shows files, line counts, and the full table
- It lets users visually filter by `file`

## Production Build

```powershell
npm run build
```

Run Compose from the project root:

```powershell
docker compose up --build
```
