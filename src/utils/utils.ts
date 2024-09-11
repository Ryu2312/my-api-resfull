import { ServerResponse } from "node:http";

export const sendJsonResponse = (
  res: ServerResponse,
  statusCode: number,
  data: object | string
) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
};
