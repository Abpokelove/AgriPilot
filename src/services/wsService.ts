const WS_URL = 'ws://localhost:8000/ws/market-updates';

type MessageCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private reconnectTimer: any = null;

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('[WebSocketService] Connected to AgriPilot backend real-time stream.');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((callback) => callback(data));
        } catch (e) {
          console.error('[WebSocketService] Failed to parse message:', e);
        }
      };

      this.socket.onclose = (event) => {
        console.warn(
          `[WebSocketService] Connection closed (code: ${event.code}, reason: ${event.reason || 'n/a'}). Attempting reconnect in 4s...`
        );
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.error('[WebSocketService] WebSocket error while streaming market updates:', err);
      };
    } catch (err) {
      console.error('[WebSocketService] Connection failed while opening real-time stream:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 4000);
  }

  public subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const wsService = new WebSocketService();
