import http from "node:http";
import {
  postUsers,
  getUsers,
  updateUsers,
  deleteUsers,
  sendJsonResponse,
} from "./utils";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  let body = "";

  if (url === "/") {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Bienvenido a mi Api RESfull");
  } else if (url === "/users") {
    switch (method) {
      case "GET":
        getUsers(response);
        break;

      case "POST":
        postUsers(request, response);
        break;
    }
  } else if (url?.match(/\/users\/\d+/)) {
    const id = parseInt(url.split("/")[2]);

    switch (method) {
      case "GET":
        getUsers(response, id);
        break;

      case "PATCH":
        updateUsers(request, response, id);
        break;

      case "PUT":
        updateUsers(request, response, id);
        break;

      case "DELETE":
        deleteUsers(response, id);
        break;
    }
  } else {
    sendJsonResponse(response, 404, {
      error: true,
      message: "Route not found",
    });
  }
});

server.listen(3000, () =>
  console.log(`Server running on http://localhost:3000/`)
);
