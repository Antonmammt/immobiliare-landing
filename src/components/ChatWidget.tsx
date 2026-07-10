"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "system";
  timestamp: string;
}

interface ChatWidgetProps {
  agenteName: string;
  agenteSlug: string;
  avatarUrl?: string;
}

export default function ChatWidget({ agenteName, agenteSlug, avatarUrl }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get current time in HH:MM format
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  // Helper function to generate UUID
  const generateUUID = (): string => {
    if (typeof window !== "undefined" && window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Initialize Session ID and Welcome Message
  useEffect(() => {
    // Generate/retrieve Session ID from sessionStorage
    let savedSessionId = sessionStorage.getItem("real_estate_chat_session_id");
    if (!savedSessionId) {
      savedSessionId = generateUUID();
      sessionStorage.setItem("real_estate_chat_session_id", savedSessionId);
    }
    setSessionId(savedSessionId);

    // Initial welcome message
    setMessages([
      {
        id: "welcome",
        text: `Ciao! Sono l'assistente virtuale di ${agenteName}. Come posso aiutarti oggi a trovare o valutare la tua casa dei sogni?`,
        sender: "bot",
        timestamp: getFormattedTime(),
      },
    ]);

    // Auto-focus input on mount
    inputRef.current?.focus();
  }, [agenteName]);

  // Scroll to bottom whenever messages list or typing state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue.trim();
    setInputValue("");

    // 1. Add user message to list
    const userMessageId = generateUUID();
    const userMessage: Message = {
      id: userMessageId,
      text: userMessageText,
      sender: "user",
      timestamp: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Show typing indicator
    setIsTyping(true);

    // 3. Prepare payload for n8n webhook
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn("NEXT_PUBLIC_WEBHOOK_URL is not set in environment variables.");
    }

    try {
      // 4. Send POST request to external webhook
      const response = await fetch(webhookUrl || "https://example.com/webhook/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          agente_riferimento: agenteSlug,
          messaggio: userMessageText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 5. Check response schema
      if (data && typeof data.risposta === "string") {
        const botResponse: Message = {
          id: generateUUID(),
          text: data.risposta,
          sender: "bot",
          timestamp: getFormattedTime(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error("Invalid response format received from webhook");
      }
    } catch (error) {
      console.error("Error communicating with chat webhook:", error);
      
      // 6. Add error fallback message
      const errorMessage: Message = {
        id: generateUUID(),
        text: "Il servizio è temporaneamente non disponibile, riprova tra poco.",
        sender: "system",
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // 7. Hide typing indicator and refocus input
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-white md:rounded-2xl md:shadow-xl md:border md:border-slate-200/80 overflow-hidden flex flex-col h-dvh md:h-[650px]">
      
      {/* WhatsApp-Style Header - fixed on mobile */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          {/* Avatar with status indicator */}
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={agenteName} className="w-10 h-10 rounded-full object-cover shadow-inner" />
            ) : (
              <img src="/avatar-default.svg" alt={agenteName} className="w-10 h-10 rounded-full shadow-inner" />
            )}
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#25d366] ring-2 ring-emerald-800" />
          </div>
          
          <div>
            <h3 className="font-semibold text-sm leading-tight text-white">{agenteName}</h3>
            <span className="text-xs text-emerald-100 opacity-90">Online</span>
          </div>
        </div>
        

      </div>

      {/* WhatsApp Wallpaper Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 wa-wallpaper custom-scrollbar flex flex-col">
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="self-center bg-red-100 text-red-800 text-xs px-3 py-1.5 rounded-lg shadow-sm max-w-[85%] text-center font-medium border border-red-200">
                {msg.text}
              </div>
            );
          }

          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isUser ? "self-end items-end" : "self-start items-start"
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`px-3.5 py-2 rounded-xl text-sm leading-relaxed shadow-sm relative ${
                  isUser
                    ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none"
                }`}
              >
                {/* Visual tail for WhatsApp-like feel */}
                <div
                  className={`absolute top-0 w-2 h-2.5 ${
                    isUser
                      ? "right-[-4px] bg-[#dcf8c6] [clip-path:polygon(0_0,0_100%,100%_0)]"
                      : "left-[-4px] bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]"
                  }`}
                />
                
                {/* Text Content */}
                <p className="whitespace-pre-line select-text">{msg.text}</p>
                
                {/* Timing & Read Receipt */}
                <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-500/80">
                  <span>{msg.timestamp}</span>
                  {isUser && (
                    <span className="text-[#34b7f1]">
                      <CheckCheck size={14} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator - WhatsApp style */}
        {isTyping && (
          <div className="self-start flex flex-col max-w-[80%] items-start animate-fade-in">
            <div className="px-4 py-2.5 rounded-xl bg-white text-slate-800 rounded-tl-none shadow-sm relative flex items-center space-x-2">
              <div className="absolute top-0 left-[-4px] bg-white w-2 h-2.5 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
              <span className="text-xs text-slate-500 italic font-medium">sta scrivendo</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce-custom delay-400" />
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce-custom delay-200" />
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce-custom" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Field Container */}
      <form onSubmit={handleSendMessage} className="bg-[#f0f2f5] px-3 py-2 flex flex-col shrink-0 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Scrivi un messaggio..."
            disabled={isTyping}
            className="flex-1 bg-white border border-slate-200 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 placeholder-slate-400 transition-all disabled:opacity-80"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#075e54] text-white p-2.5 rounded-full hover:bg-[#128c7e] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none shadow-sm shrink-0"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}
