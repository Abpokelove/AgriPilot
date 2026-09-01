const API_BASE_URL = 'http://localhost:8000/api';

export interface BackendStatus {
  service: string;
  version: string;
  health: string;
  gemini?: {
    connected: boolean;
    status: string;
    model: string;
    maskedKey: string;
  };
}

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      const errorMessage = `HTTP ${res.status} ${res.statusText}`.trim();
      console.error(`[AgriPilot API] ${endpoint} failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(
        `[AgriPilot API] Network error while calling ${endpoint}. Backend may be offline or unreachable.`,
        err
      );
    } else {
      console.error(`[AgriPilot API] Call to ${endpoint} failed. Falling back to local data.`, err);
    }
    return null;
  }
}

export const apiService = {
  getStatus: () => fetchFromApi<BackendStatus>('/status'),
  getFarmer: () => fetchFromApi('/farmer'),
  getHarvest: () => fetchFromApi('/harvest'),
  getMarkets: () => fetchFromApi('/markets'),
  getBuyers: () => fetchFromApi('/buyers'),
  getShipments: () => fetchFromApi('/shipments'),
  getSignals: () => fetchFromApi('/signals'),
  getActivity: () => fetchFromApi('/activity'),
  getRecommendation: (query?: string) =>
    fetchFromApi('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ farmer_id: 'demo-farmer', user_query: query }),
    }),
  sendChatMessage: (message: string) =>
    fetchFromApi('/chat', {
      method: 'POST',
      body: JSON.stringify({ farmer_id: 'demo-farmer', message }),
    }),
  triggerMarketShock: (marketId: string = 'market-a', surgePct: number = 70.0) =>
    fetchFromApi('/demo/market-shock', {
      method: 'POST',
      body: JSON.stringify({ market_id: marketId, arrival_surge_pct: surgePct }),
    }),
  resetMarketState: () =>
    fetchFromApi('/demo/reset', {
      method: 'POST',
    }),
};
