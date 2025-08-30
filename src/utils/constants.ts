import { LLMProvider, Tool } from '../types';

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
  },
  {
    id: 'google',
    name: 'Google',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  {
    id: 'aipipe',
    name: 'AIPipe',
    models: ['openai/gpt-4.1-nano', 'openai/gpt-4o', 'openai/gpt-4o-mini', 'anthropic/claude-3-5-sonnet', 'google/gemini-pro'],
  },
];

export const TOOLS: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'google_search',
      description: 'Search Google for information and return relevant snippets',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to execute',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'ai_pipe',
      description: 'Execute an AI workflow pipeline for complex data processing',
      parameters: {
        type: 'object',
        properties: {
          workflow: {
            type: 'string',
            description: 'The AI workflow to execute',
          },
          input: {
            type: 'string',
            description: 'Input data for the workflow',
          },
        },
        required: ['workflow', 'input'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'execute_javascript',
      description: 'Execute JavaScript code securely in the browser and return results',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The JavaScript code to execute',
          },
        },
        required: ['code'],
      },
    },
  },
];

export const DEFAULT_SYSTEM_MESSAGE = `You are an intelligent agent with access to multiple tools. You can search the web, execute AI workflows, and run JavaScript code to help users accomplish their goals. 

Always think step by step and use the appropriate tools when needed. If you need to search for information, use the google_search tool. If you need to process data with AI workflows, use the ai_pipe tool. If you need to perform calculations or execute code, use the execute_javascript tool.

Be conversational and helpful, explaining your reasoning when using tools.`;