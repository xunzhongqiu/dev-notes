# Dev Notes

[English](#english) | [简体中文](#简体中文)

## English

A small full-stack notes application demonstrating a typed Node.js API, SQLite persistence, input validation, and safe DOM text rendering in the browser client.

### Run

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. API endpoints: `GET /api/health`, `GET /api/notes`, `POST /api/notes` (`{ "title": "...", "body": "..." }`), and `DELETE /api/notes/:id`.

### Architecture

The server handles validation and SQLite writes; the browser client handles presentation. Payloads have size and field limits. Notes are stored in `dev-notes.sqlite` in the working directory.

### Next portfolio steps

Add automated tests, pagination, migrations, authentication, deployment configuration, and a screenshot. Set an explicit allowed origin before exposing the demo publicly.

## 简体中文

一个轻量的全栈笔记应用，展示带类型的 Node.js API、SQLite 持久化、输入校验，以及浏览器客户端的安全 DOM 文本渲染。

### 运行

```sh
npm install
npm run dev
```

打开 `http://localhost:3000`。API 接口包括：`GET /api/health`、`GET /api/notes`、`POST /api/notes`（请求体为 `{ "title": "...", "body": "..." }`），以及 `DELETE /api/notes/:id`。

### 架构

服务端负责输入校验和 SQLite 写入，浏览器客户端负责界面呈现。请求体大小和字段长度均有限制。笔记数据保存在当前工作目录的 `dev-notes.sqlite` 文件中。

### 后续完善方向

可以增加自动化测试、分页、数据库迁移、身份验证、部署配置和项目截图。公开部署演示应用前，请将允许的跨域来源配置为明确的域名。
