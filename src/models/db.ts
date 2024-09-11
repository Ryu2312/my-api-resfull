import { Pool } from "pg";

// Crear una nueva instancia del pool de PostgreSQL
const pool = new Pool({
  user: "ryu", // Usuario de PostgreSQL
  password: "molotov369", // Contraseña de PostgreSQL
  host: "localhost", // Host del servidor
  port: 5433, // Puerto de PostgreSQL
  database: "timetracker", // Nombre de la base de datos
});

export const query = (text: string, params?: string[]) => pool.query(text, params);
