import { IncomingMessage, ServerResponse } from "node:http";
import {
  postUsers,
  getUsers,
  updateUsers,
  deleteUsers,
  sendJsonResponse,
} from "../utils/utils";

export const routes = (request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;
  if (url === "/") {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Bienvenido a mi Api RESfull");
  } else if (url === "/users") {
    if (method === "GET") getUsers(response);
    if (method === "POST") postUsers(request, response);
  } else if (url?.match(/\/users\/\d+/)) {
    const id = parseInt(url.split("/")[2]);
    if (method === "GET") getUsers(response, id);
    if (method === "PATCH") updateUsers(request, response, id);
    if (method === "PUT") updateUsers(request, response, id);
    if (method === "DELETE") deleteUsers(response, id);
  } else {
    sendJsonResponse(response, 404, {
      error: true,
      message: "Route not found",
    });
  }
};
