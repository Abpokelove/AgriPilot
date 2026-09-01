import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile, initialFarmerContext } from '../data/farmer';
import { MarketSnapshot, baselineMarkets, shockMarkets } from '../data/markets';
import { BuyerProfile, sampleBuyers } from '../data/buyers';
import { HarvestItem, initialHarvestList } from '../data/harvest';
import { ShipmentItem, sampleShipments } from '../data/shipments';
import { ActivityLog, initialActivityLogs, shockActivityLog } from '../data/activity';
import { ExternalSignal, sampleExternalSignals } from '../data/signals';
import { RecommendationPlan, baselineRecommendation, shockRecommendation } from '../data/recommendations';
import { apiService, BackendStatus } from '../services/api';
import { wsService } from '../services/wsService';

export type NavTab = 
  | 'mission-control'
  | 'markets'
  | 'harvest'
  | 'decisions'
  | 'buyers'
  | 'shipments'
  | 'ask-agripilot'
  | 'activity';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'shock';
  title: string;
  message: string;
}

interface AgriPilotContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isShocked: boolean;
  toggleMarketShock: () => void;
  farmer: FarmerProfile;
  markets: MarketSnapshot[];
  buyers: BuyerProfile[];
  harvestList: HarvestItem[];
  addHarvestItem: (item: Omit<HarvestItem, 'id'>) => void;
  editHarvestItem: (id: string, updated: Partial<HarvestItem>) => void;
  deleteHarvestItem: (id: string) => void;
  shipments: ShipmentItem[];
  activityLogs: ActivityLog[];
  signals: ExternalSignal[];
  recommendation: RecommendationPlan;
  backendStatus: {
    health: string;
    version: string;
    service: string;
    gemini?: {
      connected: boolean;
      status: string;
      model: string;
      maskedKey: string;
    };
  } | null;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  sendChatMessage: (msg: string) => Promise<any>;
}

const AgriPilotContext = createContext<AgriPilotContextType | undefined>(undefined);

export const AgriPilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('mission-control');
  const [isShocked, setIsShocked] = useState<boolean>(false);
  const [farmer, setFarmer] = useState<FarmerProfile>(initialFarmerContext);
  const [harvestList, setHarvestList] = useState<HarvestItem[]>(initialHarvestList);
  const [buyers, setBuyers] = useState<BuyerProfile[]>(sampleBuyers);
  const [shipments, setShipments] = useState<ShipmentItem[]>(sampleShipments);
  const [signals, setSignals] = useState<ExternalSignal[]>(sampleExternalSignals);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [markets, setMarkets] = useState<MarketSnapshot[]>(baselineMarkets);
  const [recommendation, setRecommendation] = useState<RecommendationPlan>(baselineRecommendation);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Load from Backend API
  useEffect(() => {
    async function loadBackendData() {
      const [bStatus, bFarmer, bMarkets, bRecommendation, bActivity, bBuyers, bHarvest, bShipments, bSignals] =
        await Promise.all([
          apiService.getStatus(),
          apiService.getFarmer(),
          apiService.getMarkets(),
          apiService.getRecommendation(),
          apiService.getActivity(),
          apiService.getBuyers(),
          apiService.getHarvest(),
          apiService.getShipments(),
          apiService.getSignals(),
        ]);

      if (bStatus) setBackendStatus(bStatus);
      if (bFarmer) setFarmer(bFarmer as any);
      if (bMarkets) setMarkets(bMarkets as any);
      if (bRecommendation) setRecommendation(bRecommendation as any);
      if (bActivity) setActivityLogs(bActivity as any);
      if (bBuyers) setBuyers(bBuyers as any);
      if (bHarvest) setHarvestList(bHarvest as any);
      if (bShipments) setShipments(bShipments as any);
      if (bSignals) setSignals(bSignals as any);

      const failedSources = [
        !bStatus && 'status',
        !bFarmer && 'farmer',
        !bMarkets && 'markets',
        !bRecommendation && 'recommendation',
        !bActivity && 'activity',
        !bBuyers && 'buyers',
        !bHarvest && 'harvest',
        !bShipments && 'shipments',
        !bSignals && 'signals',
      ].filter(Boolean) as string[];

      if (failedSources.length > 0) {
        console.warn('[AgriPilot Context] Backend data partially unavailable:', failedSources.join(', '));
        addToast({
          type: 'warning',
          title: 'BACKEND PARTIAL OUTAGE',
          message: `Could not load: ${failedSources.join(', ')}. Local fallback data is active.`,
        });
      }

      if (bStatus?.gemini && !bStatus.gemini.connected) {
        console.warn('[AgriPilot Context] Gemini unavailable:', bStatus.gemini.status);
        addToast({
          type: 'error',
          title: 'GEMINI UNAVAILABLE',
          message: bStatus.gemini.status,
        });
      }
    }

    loadBackendData();
  }, []);

  // 2. Real-Time WebSocket Connection & Event Stream Handling
  useEffect(() => {
    wsService.connect();
    const unsubscribe = wsService.subscribe((data) => {
      if (data.type === 'MARKET_CHANGED') {
        setIsShocked(true);
        if (data.markets) setMarkets(data.markets);
        if (data.recommendation) setRecommendation(data.recommendation);
        if (data.activityLog) {
          setActivityLogs((prev) => [data.activityLog, ...prev]);
        }
        addToast({
          type: 'shock',
          title: 'MARKET CONDITIONS CHANGED ⚡',
          message: 'AgriPilot backend recalculation complete. Plan updated to maximize realization.',
        });
      } else if (data.type === 'MARKET_RESET') {
        setIsShocked(false);
        if (data.markets) setMarkets(data.markets);
        if (data.recommendation) setRecommendation(data.recommendation);
        addToast({
          type: 'info',
          title: 'BASELINE RESTORED',
          message: 'Backend market state reset to standard baseline.',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 3. Genuine Market Shock Backend Trigger
  const toggleMarketShock = async () => {
    const nextState = !isShocked;
    if (nextState) {
      const res: any = await apiService.triggerMarketShock('market-a', 70.0);
      if (!res) {
        // Fallback local toggle if backend is unreachable
        setIsShocked(true);
        setMarkets(shockMarkets);
        setRecommendation(shockRecommendation);
        setActivityLogs((prev) => [shockActivityLog, ...prev]);
        addToast({
          type: 'shock',
          title: 'MARKET CONDITIONS CHANGED ⚡',
          message: 'AgriPilot detected arrival surge in Market A. Plan updated.',
        });
      }
    } else {
      const res: any = await apiService.resetMarketState();
      if (!res) {
        setIsShocked(false);
        setMarkets(baselineMarkets);
        setRecommendation(baselineRecommendation);
        addToast({
          type: 'info',
          title: 'BASELINE RESTORED',
          message: 'Market simulation reset to standard baseline state.',
        });
      }
    }
  };

  const sendChatMessage = async (msg: string) => {
    const res: any = await apiService.sendChatMessage(msg);
    if (!res) {
      console.error('[AgriPilot Context] Chat API call failed, using local assistant fallback.');
      addToast({
        type: 'error',
        title: 'CHAT SERVICE UNAVAILABLE',
        message: 'Could not reach the backend assistant. Using local fallback response.',
      });
    }
    return res;
  };

  const addHarvestItem = (newItem: Omit<HarvestItem, 'id'>) => {
    const item: HarvestItem = {
      ...newItem,
      id: `h-${Date.now()}`,
    };
    setHarvestList((prev) => [item, ...prev]);
    addToast({
      type: 'success',
      title: 'PRODUCE ADDED',
      message: `${newItem.cropName} (${newItem.quantityKg} kg) added to harvest inventory.`,
    });
  };

  const editHarvestItem = (id: string, updated: Partial<HarvestItem>) => {
    setHarvestList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    addToast({
      type: 'info',
      title: 'PRODUCE UPDATED',
      message: 'Harvest item record modified successfully.',
    });
  };

  const deleteHarvestItem = (id: string) => {
    setHarvestList((prev) => prev.filter((item) => item.id !== id));
    addToast({
      type: 'warning',
      title: 'PRODUCE REMOVED',
      message: 'Produce record deleted from inventory.',
    });
  };

  return (
    <AgriPilotContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isShocked,
        toggleMarketShock,
        farmer,
        markets,
        buyers,
        harvestList,
        addHarvestItem,
        editHarvestItem,
        deleteHarvestItem,
        shipments,
        activityLogs,
        signals,
        recommendation,
        backendStatus,
        toasts,
        addToast,
        removeToast,
        selectedCrop,
        setSelectedCrop,
        sendChatMessage,
      }}
    >
      {children}
    </AgriPilotContext.Provider>
  );
};

export const useAgriPilot = () => {
  const context = useContext(AgriPilotContext);
  if (!context) {
    throw new Error('useAgriPilot must be used within an AgriPilotProvider');
  }
  return context;
};
