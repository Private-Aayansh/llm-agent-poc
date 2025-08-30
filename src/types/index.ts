export interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
}

export interface AgentState {
  messages: Message[];
  isLoading: boolean;
  selectedProvider: string;
  selectedModel: string;
  apiKey: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
}