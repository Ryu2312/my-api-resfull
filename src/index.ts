import http from "node:http";
import { routes } from "./routes/routes";

const server = http.createServer(routes);

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000/")
);
