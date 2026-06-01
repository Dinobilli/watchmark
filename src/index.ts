import { createApp } from "./app"

const port = Number(Bun.env["PORT"] ?? "3000")

Bun.serve({
  port,
  fetch: createApp().fetch,
})

console.log(`Watchmark listening on http://localhost:${port}/watch`)
