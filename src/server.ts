import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";

const db = new Database("dev-notes.sqlite");
db.exec(`CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)`);
const list = db.prepare("SELECT id, title, body, created_at AS createdAt FROM notes ORDER BY created_at DESC");
const insert = db.prepare("INSERT INTO notes (id, title, body, created_at) VALUES (?, ?, ?, ?)");
const remove = db.prepare("DELETE FROM notes WHERE id = ?");

function send(res: import("node:http").ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" });
  res.end(JSON.stringify(data));
}
createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,DELETE,OPTIONS", "access-control-allow-headers": "content-type" }); return res.end(); }
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  if (url.pathname === "/api/health" && req.method === "GET") return send(res, 200, { status: "ok" });
  if (url.pathname === "/api/notes" && req.method === "GET") return send(res, 200, list.all());
  if (url.pathname === "/api/notes" && req.method === "POST") {
    let raw = "";
    for await (const chunk of req) { raw += chunk; if (raw.length > 20_000) return send(res, 413, { error: "Request too large" }); }
    let data: unknown;
    try { data = JSON.parse(raw); } catch { return send(res, 400, { error: "Invalid JSON" }); }
    if (!data || typeof data !== "object" || typeof (data as any).title !== "string" || !(data as any).title.trim()) return send(res, 400, { error: "Title is required" });
    const title = (data as any).title.trim().slice(0, 120);
    const body = typeof (data as any).body === "string" ? (data as any).body.slice(0, 5000) : "";
    const note = { id: randomUUID(), title, body, createdAt: new Date().toISOString() };
    insert.run(note.id, note.title, note.body, note.createdAt);
    return send(res, 201, note);
  }
  const match = url.pathname.match(/^\/api\/notes\/([\w-]+)$/);
  if (match && req.method === "DELETE") return remove.run(match[1]).changes ? send(res, 204, null) : send(res, 404, { error: "Note not found" });
  send(res, 404, { error: "Not found" });
}).listen(Number(process.env.PORT ?? 3000), () => console.log(`Dev Notes listening on http://localhost:${process.env.PORT ?? 3000}`));
