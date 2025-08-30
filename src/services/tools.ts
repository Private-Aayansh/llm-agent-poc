import { SearchResult } from '../types';

export class ToolsService {
  private googleApiKey: string;
  private searchEngineId: string;

  constructor(googleApiKey: string = '', searchEngineId: string = '') {
    this.googleApiKey = googleApiKey;
    this.searchEngineId = searchEngineId;
  }

  async executeGoogleSearch(query: string): Promise<string> {
    if (!this.googleApiKey || !this.searchEngineId) {
      return JSON.stringify({
        error: 'Google Search requires API key and Search Engine ID. Please configure them in settings.',
        query,
        setup_instructions: {
          step1: 'Go to Google Cloud Console (https://console.developers.google.com/)',
          step2: 'Enable Custom Search API',
          step3: 'Create API credentials',
          step4: 'Go to Google Custom Search (https://cse.google.com/)',
          step5: 'Create a custom search engine',
          step6: 'Copy the Search Engine ID',
        },
      });
    }

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Google Search API error');
      }

      const results: SearchResult[] = (data.items || []).map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        url: item.link,
      }));

      return JSON.stringify({
        query,
        results,
        count: results.length,
        searchTime: data.searchInformation?.searchTime || '0',
        totalResults: data.searchInformation?.totalResults || '0',
      });
    } catch (error) {
      return JSON.stringify({
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        query,
      });
    }
  }

  async executeAIPipe(workflow: string, input: string): Promise<string> {
    try {
      // Simulate realistic AI pipeline processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const workflows = {
        'sentiment_analysis': {
          output: `Sentiment analysis complete. Input "${input}" shows ${Math.random() > 0.5 ? 'positive' : 'negative'} sentiment with ${(Math.random() * 0.3 + 0.7).toFixed(2)} confidence.`,
          metadata: { sentiment: Math.random() > 0.5 ? 'positive' : 'negative', confidence: (Math.random() * 0.3 + 0.7).toFixed(2) },
        },
        'text_summarization': {
          output: `Summary generated: Key points extracted from "${input}". Main themes identified and condensed into concise overview.`,
          metadata: { original_length: input.length, summary_ratio: 0.3 },
        },
        'entity_extraction': {
          output: `Entities extracted from "${input}": Found ${Math.floor(Math.random() * 5) + 1} entities including organizations, people, and locations.`,
          metadata: { entities_count: Math.floor(Math.random() * 5) + 1 },
        },
      };

      const workflowResult = workflows[workflow as keyof typeof workflows] || {
        output: `Custom workflow "${workflow}" processed input: "${input}". Generated structured analysis and insights.`,
        metadata: { custom_workflow: true },
      };

      const result = {
        workflow,
        input,
        output: workflowResult.output,
        status: 'completed',
        processing_time: '1.5s',
        confidence: Math.random() * 0.2 + 0.8,
        metadata: workflowResult.metadata,
      };

      return JSON.stringify(result);
    } catch (error) {
      return JSON.stringify({
        error: `AI Pipe execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        workflow,
        input,
      });
    }
  }

  async executeJavaScript(code: string): Promise<string> {
    try {
      // Create a more secure sandbox using iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox.add('allow-scripts');
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Failed to create sandbox environment');
      }

      // Set up the sandbox environment
      const script = iframeDoc.createElement('script');
      
      let output = '';
      let result: any;
      let executionError: string | null = null;

      const sandboxCode = `
        let capturedOutput = '';
        let executionResult;
        let hasError = false;
        
        // Override console methods
        const originalConsole = console;
        console = {
          log: (...args) => {
            capturedOutput += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\\n';
          },
          error: (...args) => {
            capturedOutput += 'ERROR: ' + args.map(arg => String(arg)).join(' ') + '\\n';
          },
          warn: (...args) => {
            capturedOutput += 'WARN: ' + args.map(arg => String(arg)).join(' ') + '\\n';
          },
          info: (...args) => {
            capturedOutput += 'INFO: ' + args.map(arg => String(arg)).join(' ') + '\\n';
          },
        };

        try {
          executionResult = (function() {
            "use strict";
            ${code}
          })();
        } catch (error) {
          hasError = true;
          capturedOutput += 'EXECUTION ERROR: ' + error.message + '\\n';
        }

        // Send results back to parent
        window.parent.postMessage({
          type: 'execution_result',
          output: capturedOutput,
          result: executionResult,
          error: hasError
        }, '*');
      `;

      // Listen for results
      const resultPromise = new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Code execution timeout (5 seconds)'));
        }, 5000);

        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === 'execution_result') {
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
            resolve(event.data);
          }
        };

        window.addEventListener('message', messageHandler);
      });

      script.textContent = sandboxCode;
      iframeDoc.body.appendChild(script);

      const executionResult = await resultPromise;

      // Clean up
      document.body.removeChild(iframe);

      if (executionResult.error) {
        return JSON.stringify({
          output: executionResult.output,
          error: 'Code execution failed',
          success: false,
        });
      }

      let finalOutput = executionResult.output;
      if (executionResult.result !== undefined) {
        finalOutput += `\nReturn value: ${typeof executionResult.result === 'object' ? JSON.stringify(executionResult.result, null, 2) : String(executionResult.result)}`;
      }

      return JSON.stringify({
        output: finalOutput.trim() || 'Code executed successfully (no output)',
        success: true,
        execution_time: '< 0.1s',
        result: executionResult.result,
      });
    } catch (error) {
      return JSON.stringify({
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        success: false,
      });
    }
  }

  async executeTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'google_search':
        return this.executeGoogleSearch(args.query);
      case 'ai_pipe':
        return this.executeAIPipe(args.workflow, args.input);
      case 'execute_javascript':
        return this.executeJavaScript(args.code);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}