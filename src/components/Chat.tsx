import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatProps {
  messages: Message[];
  isLoading: boolean;
}

export default function Chat({ messages, isLoading }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Welcome to the LLM Agent POC
          </h2>
          <p className="text-neutral-600 max-w-lg mx-auto">
            I'm an intelligent agent with access to Google Search, AI workflows, and JavaScript execution. 
            Configure your API keys in settings, then ask me anything!
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-blue-700 font-medium text-sm mb-1">🔍 Google Search</div>
              <div className="text-blue-600 text-xs">Real-time web search with live results</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-purple-700 font-medium text-sm mb-1">⚡ AI Workflows</div>
              <div className="text-purple-600 text-xs">Advanced AI data processing pipelines</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-yellow-700 font-medium text-sm mb-1">💻 Code Execution</div>
              <div className="text-yellow-600 text-xs">Secure JavaScript sandbox environment</div>
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble 
          key={index} 
          message={message} 
          isTyping={isLoading && index === messages.length - 1 && message.role === 'assistant'}
        />
      ))}
      
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-secondary-500 rounded-full animate-pulse-gentle"></div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}