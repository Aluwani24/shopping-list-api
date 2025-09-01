import http, { IncomingMessage, ServerResponse } from "http";
import { itemsRoute } from "./routes/item";

const PORT = 4001;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(`${req.method} ${req.url}`);
  if (req.url?.startsWith("/items")) {
    itemsRoute(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
};

http.createServer(requestListener).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
