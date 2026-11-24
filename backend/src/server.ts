import { app } from "./app.js";
const port = Number(process.env.PORT || 3001);
const server = app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`CloudLight Solutions API: http://127.0.0.1:${port}`),
);
process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
