# Files API

Node.js + Express REST API that calls the external files API, downloads CSV files from the `Secret` section, filters invalid rows, and exposes the data as JSON through `GET /files/data`.

## Requirements

- Node.js 14
- npm

If you use `nvm` on Windows:

```powershell
nvm use 14
```

## Installation

Move into the `api` folder:

```powershell
cd D:\DOCS\Docs\file-explorer\api
```

Install local dependencies:

```powershell
npm install
```

Create your local environment file from the example:

```powershell
Copy-Item .env.example .env
```

Then update `.env` with the required values.

## Start The Server

```powershell
npm start
```

## Docker

Build the image:

```powershell
docker build -t files-api .
```

Run the container:

```powershell
docker run --rm -p 3001:3001 files-api
```

The server tries to start on `3001` first.
If that port is already in use, it automatically tries `3002`, `3003`, `3004`, and so on.

Example output:

```text
Server listening on port 3003
```

## Test The Endpoint

With PowerShell:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3003/files/data" -Headers @{ accept = "application/json" }
```

With real `curl.exe`:

```powershell
curl.exe -X GET "http://localhost:3003/files/data" -H "accept: application/json"
```

If the server started on a different port, replace `3003` with the port shown in the console.

## Swagger Documentation

Once the API is running, you can open the Swagger UI at:

```text
http://localhost:3001/docs
```

The raw OpenAPI specification is also available at:

```text
http://localhost:3001/openapi.json
```

## Expected Response

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

## Run Tests

```powershell
npm test
```

The tests use only:

- Mocha
- Chai
- native Node.js modules

## Useful Commands

Install and start:

```powershell
cd D:\DOCS\Docs\file-explorer\api
npm install
npm start
```

Run tests:

```powershell
cd D:\DOCS\Docs\file-explorer\api
npm test
```

Run Compose from the project root:

```powershell
docker compose up --build
```
