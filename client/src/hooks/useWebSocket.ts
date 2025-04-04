import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '@/lib/queryClient';

export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

export const useWebSocket = () => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageIdRef = useRef<number>(0);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      try {
        if (user && user.id && !socketRef.current) {
          const userId = user.id || 0;
          const wsToken = `barter_socket_${Date.now()}`;
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsPath = '/api/ws';
          const params = `userId=${userId}&appToken=${wsToken}`;
          let wsUrl: string;

          const origin = window.location.origin;
          const baseUrl = origin.replace('http', protocol.slice(0, -1));
          wsUrl = `${baseUrl}${wsPath}?${params}`;

          try {
            new URL(wsUrl);
          } catch (error) {
            try {
              const hostname = window.location.hostname || 'localhost';
              wsUrl = `${protocol}//${hostname}/api/ws?${params}`;
              new URL(wsUrl);
            } catch (e) {
              try {
                const domain = window.location.hostname || 'localhost';
                const defaultPort = protocol === 'wss:' ? '443' : '80';
                wsUrl = `${protocol}//${domain}:${defaultPort}/api/ws?${params}`;
                new URL(wsUrl);
              } catch (e2) {
                wsUrl = `${protocol}//localhost:3000/api/ws?${params}`;
              }
            }
          }

          ws = new WebSocket(wsUrl);
          socketRef.current = ws;

          ws.addEventListener('open', () => {
            setConnected(true);
            stopPolling();
          });

          ws.addEventListener('message', (event) => {
            try {
              const data = JSON.parse(event.data.toString());
              setMessages(prev => [...prev, data]);
            } catch (err) {
              console.error('Error parsing WebSocket message:', err);
            }
          });

          ws.addEventListener('close', () => {
            setConnected(false);
            socketRef.current = null;
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              startPolling();
              reconnectTimeoutRef.current = null;
            }, 5000);
          });

          ws.addEventListener('error', (error) => {
            console.error('WebSocket error, falling back to polling:', error);
            startPolling();
          });
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        startPolling();
      }
    };

    const startPolling = () => {
      stopPolling();
      pollingIntervalRef.current = setInterval(async () => {
        if (!user?.id) return;
        try {
          const response = await apiRequest('GET', 
            `/api/messages/polling?lastId=${lastMessageIdRef.current}&userId=${user.id}`);
          const data = await response.json();

          if (data && data.messages && data.messages.length > 0) {
            if (data.messages.length > 0) {
              const maxId = Math.max(...data.messages.map((m: { id: number }) => m.id));
              lastMessageIdRef.current = Math.max(lastMessageIdRef.current, maxId);
            }

            data.messages.forEach((message: any) => {
              setMessages(prev => [...prev, {
                type: 'message',
                message: message
              }]);
            });
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }, 3000);
    };

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopPolling();
      if (ws && socketRef.current) {
        ws.close();
        socketRef.current = null;
      }
    };
  }, [user]);

  const sendMessage = async (data: WebSocketMessage) => {
    if (socketRef.current && connected) {
      try {
        socketRef.current.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    }

    try {
      const response = await apiRequest('POST', '/api/messages/send', data);
      const result = await response.json();
      return !!result.success;
    } catch (error) {
      console.error('Error sending message via HTTP:', error);
      return false;
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    connected,
    messages,
    sendMessage,
    clearMessages
  };
};
