import React from 'react';
import { User, Bot, Wrench } from 'lucide-react';
import { Message } from '../types';
import ToolCallDisplay from './ToolCallDisplay';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export default function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  if (isTool) {
    return (
      <div className="flex items-start space-x-3 animate-fade-in">
        <div className="flex-shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
          <Wrench className="w-4 h-4 text-accent-600" />
        </div>
        <div className="flex-1 bg-accent-50 border border-accent-200 rounded-lg p-3">
          <div className="text-xs font-medium text-accent-700 mb-1">Tool Result</div>
          <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono overflow-x-auto max-h-40 overflow-y-auto">
            {JSON.stringify(JSON.parse(message.content), null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 animate-fade-in ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary-100' : 'bg-secondary-100'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-600" />
        ) : (
          <Bot className="w-4 h-4 text-secondary-600" />
        )}
      </div>
      
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-white border border-neutral-200 text-neutral-800'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-typing"></span>
            )}
          </div>
        </div>
        
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.tool_calls.map((toolCall) => (
              <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}