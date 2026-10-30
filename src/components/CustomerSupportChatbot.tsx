import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { ParcelRecord } from '../types';
import { ChatMessage, processChatQuery } from '../services/aiLogisticsService';

interface CustomerSupportChatbotProps {
  parcels: ParcelRecord[];
  onInspectParcel?: (parcel: ParcelRecord) => void;
}

export const CustomerSupportChatbot: React.FC<CustomerSupportChatbotProps> = ({
  parcels,
  onInspectParcel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hello! / வணக்கம்! / ආයුබෝවන්!\n\nI am your 24/7 Pigeon AI Assistant supporting English, தமிழ், and සිංහල.\n\nAsk me for live parcel tracking (e.g., PGN-JFN-74829, PGN-KLN-38291), delivery rates, Northern Province routes, or courier queries in your preferred language.',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate instant AI reasoning & response
    setTimeout(() => {
      const botResponse = processChatQuery(query, parcels);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating 24/7 AI Support Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center gap-2.5 shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all cursor-pointer border border-orange-400/40"
            title="Open 24/7 Pigeon AI Support Chatbot (EN / தமிழ் / සිංහල)"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-white font-extrabold flex items-center gap-1">
                <span>AI Support</span>
                <Sparkles className="w-3 h-3 text-amber-200" />
              </div>
              <div className="text-[10px] text-orange-100 font-mono font-medium">
                EN · தமிழ் · සිංහල
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-50 w-[94vw] sm:w-[430px] h-[590px] max-h-[85vh] bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Pigeon AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  24/7 Trilingual Guide (EN · தமிழ் · සිංහල)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none shadow-md shadow-orange-500/20 font-medium'
                      : 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800 shadow-sm'
                  }`}
                >
                  {m.text}

                  {/* Optional Live Parcel Preview Card inside chat */}
                  {m.trackingCard && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <span className="font-extrabold text-orange-400">
                          {m.trackingCard.trackingId}
                        </span>
                        <span className="text-emerald-400 font-bold uppercase">
                          {m.trackingCard.status}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Destination: <strong>{m.trackingCard.destinationHub} Hub</strong>
                      </div>
                      <div className="text-slate-400 truncate">
                        Recipient: {m.trackingCard.recipientName}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-slate-300">
                        <span>{m.trackingCard.weightKg} KG</span>
                        <span className="font-bold text-white">
                          LKR {m.trackingCard.fareLkr.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        {onInspectParcel && (
                          <button
                            type="button"
                            onClick={() => onInspectParcel(m.trackingCard!)}
                            className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center text-[10px] font-bold"
                          >
                            Inspect In App
                          </button>
                        )}
                        <a
                          href={m.trackingCard.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1 px-2 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 text-center text-[10px] font-bold flex items-center justify-center gap-1"
                        >
                          <span>Live Site (:5173)</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full w-fit animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Pigeon AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips (English / தமிழ் / සිංහල) */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSend('Track parcel PGN-JFN-74829')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
            >
              🔍 Track PGN-JFN-74829
            </button>
            <button
              type="button"
              onClick={() => handleSend('How are standard fares calculated?')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
            >
              💰 Rates & Fares
            </button>
            <button
              type="button"
              onClick={() => handleSend('வணக்கம், எனது பார்சலை எப்படி கண்காணிப்பது?')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-orange-300 hover:text-white whitespace-nowrap cursor-pointer"
            >
              🇱🇰 தமிழ் உதவி
            </button>
            <button
              type="button"
              onClick={() => handleSend('ආයුබෝවන්, පාර්සල් ගාස්තු විස්තර මොනවාද?')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-emerald-300 hover:text-white whitespace-nowrap cursor-pointer"
            >
              🇱🇰 සිංහල සහාය
            </button>
            <button
              type="button"
              onClick={() => handleSend('What is the maximum weight limit?')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
            >
              ⚖️ 500 KG Rule
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything or enter tracking ID..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className={`p-2 rounded-xl transition-all ${
                inputQuery.trim()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-md shadow-orange-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
