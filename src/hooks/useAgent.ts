import { useState, useCallback } from 'react';
import { Message, ToolCall, AgentState } from '../types';
import { LLMService } from '../services/llm';
import { ToolsService } from '../services/tools';
import { TOOLS, DEFAULT_SYSTEM_MESSAGE } from '../utils/constants';

export function useAgent() {
  const [state, setState] = useState<AgentState>({
    messages: [],
    isLoading: false,
    selectedProvider: 'openai',
    selectedModel: 'gpt-4o-mini',
    apiKey: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [searchEngineId, setSearchEngineId] = useState<string>('');

  const updateState = useCallback((updates: Partial<AgentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const executeToolCalls = useCallback(async (toolCalls: ToolCall[]) => {
    const toolsService = new ToolsService(googleApiKey, searchEngineId);
    
    for (const toolCall of toolCalls) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await toolsService.executeTool(toolCall.function.name, args);
        
        const toolMessage: Message = {
          role: 'tool',
          content: result,
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
        };
        
        addMessage(toolMessage);
      } catch (error) {
        const errorMessage: Message = {
          role: 'tool',
          content: JSON.stringify({
            error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }),
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
        };
        
        addMessage(errorMessage);
      }
    }
  }, [addMessage, googleApiKey, searchEngineId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!state.apiKey) {
      setError('Please configure your API key in the settings');
      return;
    }

    setError(null);
    
    // Add user message
    const userMessage: Message = { role: 'user', content };
    addMessage(userMessage);
    
    updateState({ isLoading: true });

    try {
      const llmService = new LLMService(state.apiKey, state.selectedProvider, state.selectedModel);
      
      // Start reasoning loop
      let currentMessages = [...state.messages, userMessage];
      let loopCount = 0;
      const maxLoops = 10;

      while (loopCount < maxLoops) {
        // Add system message at the beginning
        const systemMessage: Message = {
          role: 'user',
          content: DEFAULT_SYSTEM_MESSAGE,
        };
        
        const messagesForLLM = [systemMessage, ...currentMessages];
        
        const response = await llmService.sendMessage(messagesForLLM, TOOLS);
        
        // Add assistant response
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.content,
          tool_calls: response.tool_calls,
        };
        
        addMessage(assistantMessage);
        currentMessages.push(assistantMessage);

        // Execute tool calls if any
        if (response.tool_calls && response.tool_calls.length > 0) {
          await executeToolCalls(response.tool_calls);
          
          // Update current messages with tool results
          const toolMessages = response.tool_calls.map(tc => ({
            role: 'tool' as const,
            content: 'Tool executed',
            tool_call_id: tc.id,
            name: tc.function.name,
          }));
          
          currentMessages.push(...toolMessages);
          loopCount++;
        } else {
          // No tool calls, conversation complete
          break;
        }
      }
      
      if (loopCount >= maxLoops) {
        setError('Maximum reasoning loops reached');
      }
    } catch (error) {
      console.error('Agent error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      updateState({ isLoading: false });
    }
  }, [state, addMessage, updateState, executeToolCalls]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ...state,
    error,
    googleApiKey,
    searchEngineId,
    sendMessage,
    updateState,
    clearError,
    setGoogleApiKey,
    setSearchEngineId,
  };
}