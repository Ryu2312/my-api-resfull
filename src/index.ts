import http from "node:http";
import fs from "node:fs/promises";
import { randomInt } from "node:crypto";

//Creando servidor HTTP
const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  type user = {
    id: number;
    name: string;
    description: string;
  };

  if (url === "/") {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(" Bienvenido a mi Api RESfull");
  } else if (url === "/users") {
    switch (method) {
      //Mostrar la lista de usuarios
      case "GET":
        try {
          const Content = await fs.readFile("./data.json", {
            encoding: "utf8",
          });
          const data = JSON.parse(Content);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ ok: true, data: data.items }));
        } catch (error) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ error: true, message: "Server Error" })
          );
        }
        break;

      //Agregar un nuevo usuario
      case "POST":
        let body = "";

        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", async () => {
          try {
            //datos del nuevo usuario
            const { name, description } = JSON.parse(body);
            const id = randomInt(1000);
            const newUser: user = {
              id,
              name,
              description,
            };

            //Se agrea el usuario nuevo a la lista de usuarios
            const data = await fs.readFile("./data.json", { encoding: "utf8" });
            const users = JSON.parse(data);
            users.items.push(newUser);
            await fs.writeFile("./data.json", JSON.stringify(users, null, 2));

            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: newUser }));
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end({ error: true, message: "Invalid data" });
          }
        });
        break;
    }
  } else if (url?.match(/\/users\/\d+/)) {
    const id = parseInt(url.split("/")[2]);
    const data = await fs.readFile("./data.json", { encoding: "utf-8" });
    let users = JSON.parse(data);
    const dataUser = users.items.find((user: user) => user.id === id);

    switch (method) {
      case "GET":
        try {
          //Se verifica que exista el usuario y se muestra
          if (dataUser) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: dataUser }));
            //Si no existe se muestra un not found
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ error: true, message: "User not found" })
            );
          }
        } catch (error) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ error: true, message: "Server Error" })
          );
        }
        break;
      case "PATCH":
        let body = "";

        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", async () => {
          try {
            const userUpdate = JSON.parse(body);
            if (dataUser) {
              users.items = users.items.map((user: user) =>
                user.id === dataUser.id
                  ? { id: dataUser.id, ...userUpdate }
                  : user
              );
              await fs.writeFile("./data.json", JSON.stringify(users, null, 2));
              response.writeHead(200, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({
                  ok: true,
                  data: { id: dataUser.id, ...userUpdate },
                })
              );
            } else {
              response.writeHead(404, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ error: true, message: "User not found" })
              );
            }
          } catch (error) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ error: true, message: "Server Error" })
            );
          }
        });
        break;
      case "DELETE":
        try {
          if (dataUser) {
            users.items = users.items.filter(
              (user: user) => user.id !== dataUser.id
            );
            await fs.writeFile("./data.json", JSON.stringify(users, null, 2));
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: dataUser }));
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ error: true, message: "User not found" })
            );
          }
        } catch (error) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ error: true, message: "Server Error" })
          );
        }
        break;
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: true, message: "Route not found" }));
  }
});

server.listen(3000, () =>
  console.log(`Server running on http://localhost:3000/`)
);
