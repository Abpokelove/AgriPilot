const configuredWsUrl = import.meta.env.VITE_WS_URL?.trim();
const WS_URLS = [
  configuredWsUrl ? configuredWsUrl.replace(/\/$/, '') : '',
  'ws://localhost:8000/ws/market-updates',
  'ws://localhost:8001/ws/market-updates',
].filter((url, index, all) => url && all.indexOf(url) === index);

type MessageCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private reconnectTimer: any = null;
  private allowReconnect = true;
  private currentUrlIndex = 0;

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.allowReconnect = true;
    this.currentUrlIndex = 0;
    this.connectAtIndex(this.currentUrlIndex);
  }

  private connectAtIndex(urlIndex: number) {
    const wsUrl = WS_URLS[urlIndex];
    if (!wsUrl) {
      this.scheduleReconnect();
      return;
    }

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[WebSocketService] Connected to AgriPilot backend real-time stream.');
        this.currentUrlIndex = 0;
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
        if (this.allowReconnect && event.code !== 1000) {
          if (this.currentUrlIndex < WS_URLS.length - 1) {
            this.currentUrlIndex += 1;
            this.connectAtIndex(this.currentUrlIndex);
            return;
          }
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (err) => {
        console.error('[WebSocketService] WebSocket error while streaming market updates:', err);
        if (this.allowReconnect && this.currentUrlIndex < WS_URLS.length - 1) {
          this.currentUrlIndex += 1;
          this.connectAtIndex(this.currentUrlIndex);
        }
      };
    } catch (err) {
      console.error('[WebSocketService] Connection failed while opening real-time stream:', err);
      if (this.allowReconnect && this.currentUrlIndex < WS_URLS.length - 1) {
        this.currentUrlIndex += 1;
        this.connectAtIndex(this.currentUrlIndex);
        return;
      }
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 4000);
  }

  public disconnect() {
    this.allowReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const wsService = new WebSocketService();
