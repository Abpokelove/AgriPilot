import React, { useState } from 'react';
import { useAgriPilot } from '../../context/AgriPilotContext';
import { MessageSquareCode, Send, Sparkles, Bot, User, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'FARMER' | 'AGRIPILOT';
  text: string;
  timestamp: string;
  decisionInputs?: string[];
  recommendationCard?: {
    title: string;
    allocations: string[];
    netRealization: string;
  };
}

export const AskAgriPilot: React.FC = () => {
  const { farmer, sendChatMessage, addToast, backendStatus } = useAgriPilot();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'FARMER',
      text: 'I need cash by Friday and can only store the tomatoes for two days.',
      timestamp: '09:40 AM',
    },
    {
      id: 'm-2',
      sender: 'AGRIPILOT',
      text: `Given your cash requirement of ₹50,000 by Friday and 2-day storage limit, I would avoid holding the full shipment. Market A currently has strong arrival pressure. Splitting allocations across Market A, Buyer B, and a partial hold balances speed of payout with upside protection.`,
      timestamp: '09:41 AM',
      decisionInputs: ['Market A Arrival Volume', 'Buyer B Payment Schedule', '2-Day Storage Decay Limit', '₹50,000 Cash Target'],
      recommendationCard: {
        title: 'Recommended Allocation',
        allocations: [
          '400 kg → Market A (Kolar APMC)',
          '200 kg → Buyer B (FreshChoice Direct)',
          '200 kg → Hold in Malur Warehouse (24H)',
        ],
        netRealization: '₹21,840',
      },
    },
  ]);

  const suggestedQuestions = [
    'Should I sell my tomatoes today?',
    'Which market gives me the best net realization?',
    'I need ₹50,000 by Friday. What should I sell?',
    'Why did my recommendation change?',
    'Can I wait two more days?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'FARMER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      // Send to FastAPI Backend Coordinator Agent
      const res = await sendChatMessage(textToSend);
      if (res && res.reply) {
        const botMsg: ChatMessage = {
          id: `m-b-${Date.now()}`,
          sender: 'AGRIPILOT',
          text: res.reply,
          timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          decisionInputs: res.decisionInputs,
          recommendationCard: res.recommendationCard,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Local Fallback if server call returned null
        throw new Error('Fallback response');
      }
    } catch (e) {
      console.error('[AskAgriPilot] Chat request failed, showing local fallback.', e);
      addToast({
        type: 'warning',
        title: 'CHAT FALLBACK ACTIVE',
        message: 'Gemini or the backend assistant is unavailable right now. Showing a local response.',
      });
      const fallbackMsg: ChatMessage = {
        id: `m-b-${Date.now()}`,
        sender: 'AGRIPILOT',
        text: `Analyzing your harvest constraints and regional mandi prices for ${farmer.activeCrop}... Splitting allocations between Market A (400 kg) and Buyer B (200 kg) yields optimal ₹21,840.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionInputs: ['Mandis Analyzed: 4', 'Buyer Contracts: 3', 'Transport Rates', 'Storage Life'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="bg-surface rounded-2xl border border-charcoal/10 p-5 shadow-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-charcoal tracking-tight">Ask AgriPilot</h1>
            <p className="text-xs text-charcoal-muted">
              Contextual agricultural decision assistant powered by Coordinator Agent & Gemini.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            {backendStatus?.gemini?.connected
              ? 'Gemini Agent API Connected'
              : 'Gemini Offline - Local Fallback Active'}
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] font-bold uppercase text-charcoal-muted shrink-0 mr-1">Suggested:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs font-semibold bg-surface hover:bg-emerald-50 text-charcoal hover:text-emerald-800 border border-charcoal/10 hover:border-emerald-300 px-3 py-1.5 rounded-full transition-all shrink-0 shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 bg-surface rounded-2xl border border-charcoal/10 p-5 shadow-card overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'FARMER';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${
                  isUser ? 'bg-charcoal text-white' : 'bg-emerald-700 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-charcoal text-white rounded-tr-none'
                      : 'bg-surface-subtle border border-charcoal/10 text-charcoal rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Structured Recommendation Card */}
                {msg.recommendationCard && (
                  <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-md border border-emerald-700 text-xs space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">
                      {msg.recommendationCard.title}
                    </span>
                    <ul className="space-y-1">
                      {msg.recommendationCard.allocations.map((alloc, i) => (
                        <li key={i} className="font-semibold text-emerald-100 flex items-center space-x-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{alloc}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-white/10 text-right">
                      <span className="text-[10px] text-emerald-300 font-bold">Est Net: </span>
                      <span className="font-extrabold text-white text-sm">
                        {msg.recommendationCard.netRealization}
                      </span>
                    </div>
                  </div>
                )}

                {/* Decision Input Badges */}
                {msg.decisionInputs && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] text-charcoal-light font-bold uppercase self-center mr-1">
                      Decision Factors:
                    </span>
                    {msg.decisionInputs.map((input, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200"
                      >
                        {input}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 p-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>AgriPilot Coordinator Agent is reasoning...</span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-surface rounded-2xl border border-charcoal/15 p-2 shadow-subtle flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask about your harvest, markets or next move..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-charcoal focus:outline-none placeholder:text-charcoal-light"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
