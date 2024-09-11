import { IncomingMessage, ServerResponse } from "http";
import { sendJsonResponse } from "../utils/utils";
import { query } from "../models/db";

export function postUsers(request: IncomingMessage, response: ServerResponse) {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", async () => {
    try {
      const { name, email, role, rate } = JSON.parse(body);
      const result = await query(
        "INSERT INTO users (name,email,role,rate) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, role, rate]
      );
      sendJsonResponse(response, 201, { ok: true, data: result.rows[0] });
    } catch (error) {
      sendJsonResponse(response, 400, {
        error: true,
        message: "Invalid data",
      });
    }
  });
}

export async function getUsers(response: ServerResponse, id?: number) {
  try {
    const sentencia = id
      ? "SELECT * FROM users WHERE id = $1"
      : "SELECT * FROM users ORDER BY id";
    const dataUser = await query(sentencia, id ? [id] : []);

    if (dataUser.rows.length > 0) {
      sendJsonResponse(response, 200, { ok: true, data: dataUser.rows });
    } else {
      sendJsonResponse(response, 404, {
        error: true,
        message: "User Not Found",
      });
    }
  } catch (error) {
    sendJsonResponse(response, 500, {
      error: true,
      message: "Server Error",
    });
  }
}

export async function updateUsers(
  request: IncomingMessage,
  response: ServerResponse,
  id: number
) {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", async () => {
    try {
      const dataUser = await query("SELECT * FROM users WHERE id = $1", [id]);

      if (dataUser.rows.length > 0) {
        const userUpdate = { ...dataUser.rows[0], ...JSON.parse(body) };
        const { name, email, role, rate } = userUpdate;
        const result = await query(
          "UPDATE users SET name = $1, email = $2, role = $3, rate = $4 WHERE id = $5  RETURNING *",
          [name, email, role, rate, id]
        );
        sendJsonResponse(response, 200, {
          ok: true,
          data: result.rows[0],
        });
      } else {
        sendJsonResponse(response, 404, {
          error: true,
          message: "User Not Found",
        });
      }
    } catch (error) {
      sendJsonResponse(response, 500, {
        error: true,
        message: "Server Error",
      });
    }
  });
}

export async function deleteUsers(response: ServerResponse, id: number) {
  try {
    const dataUser = await query("SELECT * FROM users WHERE id = $1", [id]);

    if (dataUser.rows.length > 0) {
      const result = await query("DELETE FROM users WHERE id = $1", [id]);
      sendJsonResponse(response, 200, {
        ok: true,
        message: "User deleted successfully",
      });
    } else {
      sendJsonResponse(response, 404, {
        error: true,
        message: "User Not Found",
      });
    }
  } catch (error) {
    sendJsonResponse(response, 500, {
      error: true,
      message: "Server Error",
    });
  }
}
