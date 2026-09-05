const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URLS = [
  configuredApiBaseUrl ? configuredApiBaseUrl.replace(/\/$/, '') : '',
  'http://localhost:8000/api',
  'http://localhost:8001/api',
].filter((baseUrl, index, all) => baseUrl && all.indexOf(baseUrl) === index);

const AUTH_TOKEN_KEY = 'agripilot.auth.token';

class ApiRequestError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiRequestError';
    this.status = status;
    this.detail = detail;
  }
}

export interface AuthUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  location: string;
  primaryCrop: string;
  avatarSeed: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: 'bearer';
  user: AuthUser;
}

export interface BackendStatus {
  service: string;
  version: string;
  health: string;
  backend?: string;
  database?: string;
  websocket?: string;
  gemini?: {
    connected: boolean;
    status: string;
    model: string;
    maskedKey: string;
  };
}

async function fetchFromApiBase<T>(baseUrl: string, endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        ...(options?.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errorMessage = `HTTP ${res.status} ${res.statusText}`.trim();
      console.error(`[AgriPilot API] ${endpoint} failed against ${baseUrl}: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(`[AgriPilot API] Network error while calling ${endpoint} via ${baseUrl}.`, err);
      return null;
    }
    throw err;
  }
}

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  let lastError: unknown = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const result = await fetchFromApiBase<T>(baseUrl, endpoint, options);
      if (result !== null) {
        return result;
      }
    } catch (err) {
      lastError = err;
      break;
    }
  }

  if (lastError) {
    console.error(`[AgriPilot API] Call to ${endpoint} failed. Falling back to local data.`, lastError);
  }

  return null;
}

async function fetchJsonWithErrorsBase<T>(baseUrl: string, endpoint: string, options?: RequestInit): Promise<T | null> {
  const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  const rawBody = await res.text();
  const parsedBody = rawBody
    ? (() => {
        try {
          return JSON.parse(rawBody);
        } catch {
          return null;
        }
      })()
    : null;

  if (!res.ok) {
    const backendDetail =
      (parsedBody && typeof parsedBody === 'object' && 'detail' in parsedBody && String((parsedBody as { detail: unknown }).detail)) ||
      (parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody && String((parsedBody as { message: unknown }).message)) ||
      `${res.status} ${res.statusText}`.trim();
    throw new ApiRequestError(res.status, backendDetail);
  }

  return parsedBody as T;
}

async function fetchJsonWithErrors<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let lastError: unknown = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const result = await fetchJsonWithErrorsBase<T>(baseUrl, endpoint, options);
      if (result !== null) {
        return result;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error(`Unable to reach API for ${endpoint}`);
}

export const apiService = {
  authTokenKey: AUTH_TOKEN_KEY,
  getStoredToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setStoredToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearStoredToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
  getStatus: () => fetchFromApi<BackendStatus>('/status'),
  getMe: async (): Promise<AuthUser | null> => {
    const remote = await fetchFromApi<AuthUser>('/auth/me');
    if (remote) return remote;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    return {
      id: 'farmer-arjun-01',
      fullName: 'Arjun Patel',
      mobileNumber: '9876543210',
      email: 'arjun@agripilot.demo',
      location: 'Kolar Region',
      primaryCrop: 'Tomato',
      avatarSeed: 'AP',
      createdAt: new Date().toISOString(),
    };
  },
  login: async (identifier: string, password: string): Promise<AuthSession> => {
    try {
      return await fetchJsonWithErrors<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.message.includes('Failed to fetch'))) {
        console.warn('[AgriPilot API] Backend offline, issuing local session for user.');
        return {
          accessToken: `demo-token-${Date.now()}`,
          tokenType: 'bearer',
          user: {
            id: 'farmer-arjun-01',
            fullName: identifier.includes('@') ? identifier.split('@')[0] : 'Arjun Patel',
            mobileNumber: '9876543210',
            email: identifier.includes('@') ? identifier : 'arjun@agripilot.demo',
            location: 'Kolar Region',
            primaryCrop: 'Tomato',
            avatarSeed: 'AP',
            createdAt: new Date().toISOString(),
          },
        };
      }
      throw err;
    }
  },
  demoLogin: async (): Promise<AuthSession> => {
    try {
      return await fetchJsonWithErrors<AuthSession>('/auth/demo', {
        method: 'POST',
      });
    } catch {
      return {
        accessToken: `demo-token-${Date.now()}`,
        tokenType: 'bearer',
        user: {
          id: 'farmer-arjun-01',
          fullName: 'Arjun Patel',
          mobileNumber: '9876543210',
          email: 'arjun@agripilot.demo',
          location: 'Kolar Region',
          primaryCrop: 'Tomato',
          avatarSeed: 'AP',
          createdAt: new Date().toISOString(),
        },
      };
    }
  },
  register: async (payload: {
    fullName: string;
    mobileNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    location: string;
    primaryCrop: string;
  }): Promise<AuthSession> => {
    try {
      return await fetchJsonWithErrors<AuthSession>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.message.includes('Failed to fetch'))) {
        return {
          accessToken: `reg-token-${Date.now()}`,
          tokenType: 'bearer',
          user: {
            id: `farmer-${Date.now()}`,
            fullName: payload.fullName,
            mobileNumber: payload.mobileNumber,
            email: payload.email,
            location: payload.location,
            primaryCrop: payload.primaryCrop,
            avatarSeed: (payload.fullName.slice(0, 2) || 'AP').toUpperCase(),
            createdAt: new Date().toISOString(),
          },
        };
      }
      throw err;
    }
  },
  logout: () =>
    fetchFromApi('/auth/logout', {
      method: 'POST',
    }),
  getFarmer: () => fetchFromApi('/farmer'),
  getHarvest: () => fetchFromApi('/harvest'),
  addHarvestItem: (payload: {
    cropName: string;
    variety: string;
    quantityKg: number;
    harvestDate: string;
    storageLimitDays: number;
    status: 'READY' | 'GROWING' | 'HARVESTED' | 'DISPATCHED';
    estimatedValue: number;
    fieldLocation: string;
  }) =>
    fetchFromApi('/harvest', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateHarvestItem: (
    itemId: string,
    payload: Partial<{
      cropName: string;
      variety: string;
      quantityKg: number;
      harvestDate: string;
      storageLimitDays: number;
      status: 'READY' | 'GROWING' | 'HARVESTED' | 'DISPATCHED';
      estimatedValue: number;
      fieldLocation: string;
    }>
  ) =>
    fetchFromApi(`/harvest/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteHarvestItem: (itemId: string) =>
    fetchFromApi(`/harvest/${itemId}`, {
      method: 'DELETE',
    }),
  updateCrop: (activeCrop: string) =>
    fetchFromApi('/farmer/crop', {
      method: 'PUT',
      body: JSON.stringify({ activeCrop }),
    }),
  getMarkets: (crop?: string) =>
    fetchFromApi(crop ? `/markets?crop=${encodeURIComponent(crop)}` : '/markets'),
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
