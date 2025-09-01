import { IncomingMessage, ServerResponse } from "http";
import {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/item";
import { sendJson } from "../utils/errorHandler";

// Helper to parse request body
const parseRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

export const itemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  const cleanUrl = req.url?.split("?")[0] || "/";
  const urlParts = cleanUrl.split("/").filter(Boolean); // ["items", ":id"?]
  const idParam = urlParts[1];
  const id = idParam ? parseInt(idParam, 10) : undefined;

  // GET /items or /items/:id
  if (req.method === "GET") {
    if (urlParts.length === 1) {
      return sendJson(res, 200, getAllItems());
    }

    if (isNaN(id!)) {
      return sendJson(res, 400, { error: "Invalid item ID" });
    }

    const item = getItemById(id!);
    return item
      ? sendJson(res, 200, item)
      : sendJson(res, 404, { error: "Item not found" });
  }

  // POST /items
  if (req.method === "POST" && urlParts.length === 1) {
    try {
      const { name, quantity } = await parseRequestBody(req);

      if (typeof name !== "string" || !name.trim()) {
        return sendJson(res, 400, { error: "Name is required" });
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        return sendJson(res, 400, { error: "Quantity must be a positive number" });
      }

      const newItem = addItem(name.trim(), quantity);
      return sendJson(res, 201, newItem);
    } catch (err) {
      const error = err as Error;
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /items/:id
  if (req.method === "PUT" && urlParts.length === 2) {
    if (isNaN(id!)) {
      return sendJson(res, 400, { error: "Invalid item ID" });
    }

    try {
      const data = await parseRequestBody(req);
      const allowed = ["name", "quantity", "purchased"];
      const updateData: Record<string, unknown> = {};

      for (const key of allowed) {
        if (key in data) updateData[key] = data[key];
      }

      const updated = updateItem(id!, updateData);
      return updated
        ? sendJson(res, 200, updated)
        : sendJson(res, 404, { error: "Item not found" });
    } catch (err) {
      const error = err as Error;
      return sendJson(res, 400, { error: error.message });
    }
  }

  // DELETE /items/:id
  if (req.method === "DELETE" && urlParts.length === 2) {
    if (isNaN(id!)) {
      return sendJson(res, 400, { error: "Invalid item ID" });
    }

    return deleteItem(id!)
      ? res.writeHead(204).end()
      : sendJson(res, 404, { error: "Item not found" });
  }

  // Method Not Allowed
  sendJson(res, 405, { error: "Method Not Allowed" });
};
