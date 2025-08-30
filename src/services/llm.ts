import { Message, ToolCall, Tool } from '../types';

export class LLMService {
  private apiKey: string;
  private provider: string;
  private model: string;

  constructor(apiKey: string, provider: string, model: string) {
    this.apiKey = apiKey;
    this.provider = provider;
    this.model = model;
  }

  async sendMessage(messages: Message[], tools: Tool[]): Promise<{ content: string; tool_calls?: ToolCall[] }> {
    try {
      const endpoint = this.getEndpoint();
      const headers = this.getHeaders();
      const body = this.formatRequest(messages, tools);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw error;
    }
  }

  private getEndpoint(): string {
    switch (this.provider) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      case 'google':
        return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
      case 'aipipe':
        return 'https://aipipe.org/openrouter/v1/chat/completions';
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private getHeaders(): Record<string, string> {
    const baseHeaders = {
      'Content-Type': 'application/json',
    };

    switch (this.provider) {
      case 'openai':
        return {
          ...baseHeaders,
          'Authorization': `Bearer ${this.apiKey}`,
        };
      case 'anthropic':
        return {
          ...baseHeaders,
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        };
      case 'google':
        return {
          ...baseHeaders,
          'x-goog-api-key': this.apiKey,
        };
      case 'aipipe':
        return {
          ...baseHeaders,
          'Authorization': `Bearer ${this.apiKey}`,
        };
      default:
        return baseHeaders;
    }
  }

  private formatRequest(messages: Message[], tools: Tool[]): any {
    switch (this.provider) {
      case 'openai':
        return {
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            tool_calls: msg.tool_calls,
            tool_call_id: msg.tool_call_id,
            name: msg.name,
          })),
          tools: tools.length > 0 ? tools : undefined,
          tool_choice: tools.length > 0 ? 'auto' : undefined,
        };
      case 'anthropic':
        // Simplified for POC - would need proper Claude formatting
        return {
          model: this.model,
          max_tokens: 1024,
          messages: messages.filter(m => m.role !== 'tool').map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
        };
      case 'google':
        // Simplified for POC - would need proper Gemini formatting
        return {
          contents: messages.filter(m => m.role !== 'tool').map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
        };
      case 'aipipe':
        return {
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            tool_calls: msg.tool_calls,
            tool_call_id: msg.tool_call_id,
            name: msg.name,
          })),
          tools: tools.length > 0 ? tools : undefined,
          tool_choice: tools.length > 0 ? 'auto' : undefined,
        };
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private parseResponse(data: any): { content: string; tool_calls?: ToolCall[] } {
    switch (this.provider) {
      case 'openai':
        const choice = data.choices?.[0];
        if (!choice) throw new Error('No response from LLM');
        
        return {
          content: choice.message?.content || '',
          tool_calls: choice.message?.tool_calls,
        };
      case 'anthropic':
        return {
          content: data.content?.[0]?.text || '',
        };
      case 'google':
        return {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        };
      case 'aipipe':
        const aipipeChoice = data.choices?.[0];
        if (!aipipeChoice) throw new Error('No response from AIPipe');
        
        return {
          content: aipipeChoice.message?.content || '',
          tool_calls: aipipeChoice.message?.tool_calls,
        };
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }
}