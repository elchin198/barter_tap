import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';

interface Client {
  id: string;
  ws: WebSocket;
}

let clients: Client[] = [];

/**
 * WebSocket server qurulması
 */
export function setupWebSocketServer(server: Server) {
  try {
    const wss = new WebSocketServer({ 
      server,
      path: '/ws',
      perMessageDeflate: false
    });

    console.log("✅ WebSocket serveri işə salındı, yol: /ws...");

    wss.on('connection', (ws) => {
      const clientId = Math.random().toString(36).substring(2, 15);
      clients.push({ id: clientId, ws });

      console.log(`🔌 Yeni bağlantı: ${clientId}`);

      // Mesaj alındıqda
      ws.on('message', (message) => {
        console.log(`📩 Mesaj alındı (${clientId}):`, message.toString());

        try {
          const parsedMessage = JSON.parse(message.toString());

          ws.send(JSON.stringify({
            type: 'echo',
            originalMessage: parsedMessage,
            timestamp: new Date().toISOString()
          }));

        } catch (error) {
          console.error("❌ Mesaj emalında xəta:", error);

          ws.send(JSON.stringify({
            type: 'error',
            message: 'Mesaj emalında xəta baş verdi',
            error: (error as Error).message,
            timestamp: new Date().toISOString()
          }));
        }
      });

      // Bağlantı bağlanarsa
      ws.on('close', () => {
        console.log(`❎ Bağlantı bağlandı: ${clientId}`);
        clients = clients.filter(client => client.id !== clientId);
      });

      ws.on('error', (error) => {
        console.error(`⚠️ WebSocket xətası (${clientId}):`, error);
      });
    });

    wss.on('error', (error) => {
      console.error("🚨 WebSocket serverində xəta:", error);
    });

    return wss;
  } catch (error) {
    console.error("🧨 WebSocket server qurulmasında xəta:", error);
    throw error;
  }
}

/**
 * Broadcast funksiyası — bütün müştərilərə mesaj göndər
 */
export function broadcastMessage(message: any) {
  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}
