# Dev Notes

A small full-stack notes application showing a typed Node.js API, SQLite persistence, input validation, and a browser client that uses safe DOM text rendering.

## Run

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. API endpoints: `GET /api/health`, `GET /api/notes`, `POST /api/notes` (`{ "title": "...", "body": "..." }`), and `DELETE /api/notes/:id`.

## Architecture

The server owns validation and SQLite writes; the browser client handles presentation. Payloads have size and field limits. Notes are stored in `dev-notes.sqlite` in the working directory.

## Next portfolio steps

Add automated tests, pagination, migrations, authentication, deployment configuration, and a screenshot. Set an explicit allowed origin before exposing the demo publicly.
