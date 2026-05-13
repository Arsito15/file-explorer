# Frontend Usage Guide

This document explains how to use the `Files Dashboard` interface once the frontend is running.

## Access

Open the frontend in your browser:

```text
http://localhost:8080
```

The application expects the backend to be available on one of the local ports between `3001` and `3010`.

## Screen Overview

The interface is divided into two main sections:

- `Data viewer`: displays the file filter, refresh action, and parsed table data
- `Summary by file`: displays a quick summary of valid lines per file

## Main Actions

### Filter by file

Use the dropdown at the top of the `Data viewer` section.

Options:

- `All files`: shows data for every available file
- `<fileName>.csv`: shows only the selected file

When a file is selected, the frontend calls:

```text
GET /files/data?fileName=<selected-file>
```

When `All files` is selected, the frontend calls:

```text
GET /files/data
```

### Refresh data

Click `Update` to request the latest information from the backend.

The refresh action reloads:

- the available file list from `GET /files/list`
- the table data from `GET /files/data` or `GET /files/data?fileName=...`

## Table Content

The main table shows these columns:

- `File`: CSV file name
- `Text`: valid text value from the CSV row
- `Number`: numeric value formatted for readability
- `Hex`: 32-character hexadecimal value

Only valid rows are shown. Invalid rows are filtered out by the backend before the frontend receives the response.

## Summary Panel

The panel on the right shows one card per file.

Each card displays:

- the file name
- the number of valid lines returned by the backend

When a file filter is active, the summary reflects only the currently loaded dataset.

## Loading And Error States

### Loading

While the frontend is requesting data, the interface shows a loading message:

```text
Searching the API and loading files...
```

During this state, the `Update` button is disabled.

### Error

If the frontend cannot connect to the backend, an error message is shown.

Common causes:

- the backend is not running
- the backend is running on a different port outside `3001` to `3010`
- Docker containers were not rebuilt after backend changes

## Expected Backend Endpoints

The frontend depends on these backend routes:

- `GET /files/list`
- `GET /files/data`
- `GET /files/data?fileName=<file-name>`

## Typical Usage Flow

1. Start the backend
2. Start the frontend
3. Open `http://localhost:8080`
4. Wait for the file list and table data to load
5. Select a specific file from the dropdown if needed
6. Click `Update` whenever you want to reload the data

## Troubleshooting

### The page shows a connection error

Check that the backend is available:

```text
http://localhost:3001/files/list
```

If you are using Docker, rebuild and restart the stack:

```powershell
make down
make up
```

### The filter is empty

This usually means the backend did not return a valid file list.

Verify:

- the backend is running
- the external API token is configured correctly in `api/.env`

### The data looks outdated

Use the `Update` button to fetch fresh data from the backend.
