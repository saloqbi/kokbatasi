
let clients = [];

function registerWebSocketServer(wss) {
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    clients.push(ws);

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clients = clients.filter(client => client !== ws);
    });
  });
}

function broadcastNewSignal(signal) {
  const data = JSON.stringify({ type: 'new_signal', payload: signal });
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

module.exports = {
  registerWebSocketServer,
  broadcastNewSignal
};
