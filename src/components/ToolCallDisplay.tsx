import React from 'react';
import { Search, Code, Zap, Play } from 'lucide-react';
import { ToolCall } from '../types';

interface ToolCallDisplayProps {
  toolCall: ToolCall;
}

export default function ToolCallDisplay({ toolCall }: ToolCallDisplayProps) {
  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'google_search':
        return <Search className="w-4 h-4" />;
      case 'execute_javascript':
        return <Code className="w-4 h-4" />;
      case 'ai_pipe':
        return <Zap className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getToolColor = (toolName: string) => {
    switch (toolName) {
      case 'google_search':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'execute_javascript':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'ai_pipe':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-700';
    }
  };

  const args = JSON.parse(toolCall.function.arguments);

  return (
    <div className={`border rounded-lg p-3 ${getToolColor(toolCall.function.name)} animate-slide-up`}>
      <div className="flex items-center space-x-2 mb-2">
        {getToolIcon(toolCall.function.name)}
        <span className="text-xs font-medium uppercase tracking-wide">
          {toolCall.function.name.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="text-xs bg-white/50 rounded px-2 py-1 overflow-x-auto">
        <div className="font-medium mb-1">Parameters:</div>
        <pre className="font-mono text-xs">{JSON.stringify(args, null, 2)}</pre>
      </div>
    </div>
  );
}