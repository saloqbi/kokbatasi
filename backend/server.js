const http = require("http");
const app = require("./index");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});