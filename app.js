const form = document.querySelector("#note-form");
const notes = document.querySelector("#notes");
const message = document.querySelector("#message");
async function refresh() {
  const response = await fetch("/api/notes");
  const data = await response.json();
  notes.replaceChildren();
  if (!data.length) { notes.textContent = "还没有笔记。"; return; }
  for (const note of data) {
    const article = document.createElement("article");
    const title = document.createElement("h3"); title.textContent = note.title;
    const body = document.createElement("p"); body.textContent = note.body;
    const date = document.createElement("time"); date.dateTime = note.createdAt; date.textContent = new Date(note.createdAt).toLocaleString();
    const remove = document.createElement("button"); remove.className = "delete"; remove.textContent = "删除";
    remove.addEventListener("click", async () => { await fetch(`/api/notes/${note.id}`, { method: "DELETE" }); refresh(); });
    article.append(title, body, date, remove); notes.append(article);
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault(); message.textContent = "";
  const response = await fetch("/api/notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: form.title.value, body: form.body.value }) });
  if (!response.ok) { message.textContent = (await response.json()).error; return; }
  form.reset(); message.textContent = "已保存"; refresh();
});
refresh().catch(() => { message.textContent = "无法连接 API，请确认服务已启动。"; });
