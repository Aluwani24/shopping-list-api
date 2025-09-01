import { ServerResponse } from "http";

export const sendJson = (
  res: ServerResponse,
  status: number,
  payload: unknown
) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};
