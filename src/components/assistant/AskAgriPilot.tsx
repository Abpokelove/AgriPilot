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
      text: 'Sell most now, keep only what fits the storage limit, and protect cash flow first.',
      timestamp: '09:41 AM',
      decisionInputs: ['2-day storage limit', 'Cash needed by Friday', 'Market arrival pressure'],
      recommendationCard: {
        title: 'Recommended split',
        allocations: [
          '400 kg → Market A',
          '200 kg → Buyer B',
          '200 kg → Hold 24H only if needed',
        ],
        netRealization: '₹21,840',
      },
    },
  ]);

  const suggestedQuestions = [
    'Should I sell my tomatoes today?',
    'Which market gives the best return?',
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
      const res = await sendChatMessage(textToSend);

      if (!res || !res.reply) {
        throw new Error('Empty assistant response');
      }

      const botMsg: ChatMessage = {
        id: `m-b-${Date.now()}`,
        sender: 'AGRIPILOT',
        text: res.reply,
        timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionInputs: res.decisionInputs,
        recommendationCard: res.recommendationCard,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('[AskAgriPilot] Gemini or backend chat failed', {
        error,
        geminiConnected: backendStatus?.gemini?.connected,
        activeCrop: farmer.activeCrop,
        input: textToSend,
      });

      addToast({
        type: 'warning',
        title: backendStatus?.gemini?.connected ? 'Assistant unavailable' : "Can't connect to Gemini",
        message: backendStatus?.gemini?.connected
          ? 'The assistant did not return a reply. Showing a local fallback.'
          : 'Gemini is offline right now. Showing a local fallback.',
      });

      const fallbackMsg: ChatMessage = {
        id: `m-b-${Date.now()}`,
        sender: 'AGRIPILOT',
        text: `I can help with ${farmer.activeCrop}, but the assistant is offline right now. Use the shortest path: sell the urgent lot first, then hold the rest only if the storage window allows it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionInputs: ['Gemini unavailable', 'Local fallback', 'Storage and cash constraints'],
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
      <div className="agri-card agri-leaf-side bg-surface rounded-2xl border border-charcoal/10 p-5 shadow-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-charcoal tracking-tight">Ask AgriPilot</h1>
            <p className="text-xs text-charcoal-muted">Short answers, clear next steps.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{backendStatus?.gemini?.connected ? 'Gemini connected' : 'Gemini offline'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] font-bold uppercase text-charcoal-muted shrink-0 mr-1">Suggested:</span>
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSend(question)}
            className="text-xs font-semibold bg-surface hover:bg-emerald-50 text-charcoal hover:text-emerald-800 border border-charcoal/10 hover:border-emerald-300 px-3 py-1.5 rounded-full transition-all shrink-0 shadow-xs"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="agri-card agri-field-lines flex-1 bg-surface rounded-2xl border border-charcoal/10 p-5 shadow-card overflow-y-auto space-y-4">
        {messages.map((message) => {
          const isUser = message.sender === 'FARMER';

          return (
            <div
              key={message.id}
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
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>

                {message.recommendationCard && (
                  <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-md border border-emerald-700 text-xs space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">
                      {message.recommendationCard.title}
                    </span>
                    <ul className="space-y-1">
                      {message.recommendationCard.allocations.map((allocation, allocationIndex) => (
                        <li key={allocationIndex} className="font-semibold text-emerald-100 flex items-center space-x-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{allocation}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-white/10 text-right">
                      <span className="text-[10px] text-emerald-300 font-bold">Est net: </span>
                      <span className="font-extrabold text-white text-sm">{message.recommendationCard.netRealization}</span>
                    </div>
                  </div>
                )}

                {message.decisionInputs && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] text-charcoal-light font-bold uppercase self-center mr-1">
                      Decision factors:
                    </span>
                    {message.decisionInputs.map((input, index) => (
                      <span
                        key={index}
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
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>AgriPilot is thinking...</span>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-surface rounded-2xl border border-charcoal/15 p-2 shadow-subtle flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask about your harvest, markets, or next move..."
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
