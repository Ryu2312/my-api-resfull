import http from "node:http";
import fs from "node:fs/promises";
import { randomInt } from "node:crypto";
import { query } from "./models/db";

//Creando servidor HTTP
const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  let body = "";

  if (url === "/") {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(" Bienvenido a mi Api RESfull");
  } else if (url === "/users") {
    switch (method) {
      //Mostrar la lista de usuarios
      case "GET":
        try {
          /* const Content = await fs.readFile("./data.json", {
            encoding: "utf8",
          });
          const data = JSON.parse(Content); */
          const data = await query("SELECT * FROM users ORDER BY id");
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ ok: true, data: data.rows }));
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
            const { name, email, role, rate } = JSON.parse(body);

            //Se agrea el usuario nuevo a la lista de usuarios
            /* const data = await fs.readFile("./data.json", { encoding: "utf8" }); */
            /*  const users = JSON.parse(data);
            users.items.push(newUser);
            await fs.writeFile("./data.json", JSON.stringify(users, null, 2)); */
            const result = await query(
              "INSERT INTO users (name,email,role,rate) VALUES ($1, $2, $3, $4) RETURNING *",
              [name, email, role, rate]
            );

            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: result.rows[0] }));
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end({ error: true, message: "Invalid data" });
          }
        });
        break;
    }
  } else if (url?.match(/\/users\/\d+/)) {
    const id = parseInt(url.split("/")[2]);
    /*  const data = await fs.readFile("./data.json", { encoding: "utf-8" });
    let users = JSON.parse(data);
    const dataUser = users.items.find((user: user) => user.id === id); */
    const dataUser = await query("SELECT *   FROM users WHERE id = $1", [id]);

    switch (method) {
      case "GET":
        try {
          //Se verifica que exista el usuario y se muestra
          if (dataUser.rows) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: dataUser.rows }));
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
        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", async () => {
          try {
            if (dataUser.rows) {
              const userUpdate = { ...dataUser.rows[0], ...JSON.parse(body) };
              const { name, email, role, rate } = userUpdate;
              const result = await query(
                "UPDATE users SET name = $1, email = $2, role = $3, rate = $4 WHERE id = $5  RETURNING *",
                [name, email, role, rate, id]
              );
              /* users.items = users.items.map((user: user) =>
                user.id === dataUser.id
                  ? { id: dataUser.id, ...userUpdate }
                  : user
              );
              await fs.writeFile("./data.json", JSON.stringify(users, null, 2)); */
              response.writeHead(200, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({
                  ok: true,
                  data: result.rows[0],
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
      case "PUT":
        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", async () => {
          try {
            if (dataUser.rows) {
              const userUpdate = { ...dataUser.rows[0], ...JSON.parse(body) };
              const { name, email, role, rate } = userUpdate;
              const result = await query(
                "UPDATE users SET name = $1, email = $2, role = $3, rate = $4 WHERE id = $5  RETURNING *",
                [name, email, role, rate, id]
              );
              response.writeHead(200, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({
                  ok: true,
                  data: result.rows[0],
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
          if (dataUser.rows) {
            const result = await query(
              "DELETE FROM users WHERE id = $1 RETURNING *",
              [id]
            );
            /* users.items = users.items.filter(
              (user: user) => user.id !== dataUser.id
            );
            await fs.writeFile("./data.json", JSON.stringify(users, null, 2)); */
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ ok: true, data: result.rows[0] }));
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
