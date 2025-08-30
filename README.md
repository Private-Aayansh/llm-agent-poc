# LLM Agent POC - Multi-Tool Reasoning System

A proof-of-concept intelligent agent that demonstrates multi-tool reasoning capabilities with real-time web search, AI workflow execution, and secure JavaScript code execution.

## 🚀 Features

### 🤖 Multi-Provider LLM Support
- **OpenAI**: gpt-5, gpt-4.1, gpt-4o
- **Anthropic**: claude-opus-4.1, claude-sonnet-4
- **Google**: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite, gemini-2.5-deep-think
- **AIPipe**: openai/gpt-4.1-nano, openai/gpt-4o, google/gemini-2.0-flash-lite-001

### 🛠️ Intelligent Tool System
- **🔍 Google Search**: Real-time web search with live results
- **⚡ AI Workflows**: Advanced AI data processing pipelines
- **💻 Code Execution**: Secure JavaScript sandbox environment

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Real-time chat interface with typing indicators
- Tool execution visualization
- Error handling with user-friendly alerts
- Gradient backgrounds and smooth animations

## 🏗️ Architecture

The project follows a modular architecture with clear separation of concerns:

```
src/
├── components/          # React UI components
│   ├── Alert.tsx       # Error/success notifications
│   ├── Chat.tsx        # Main chat interface
│   ├── ChatInput.tsx   # Message input component
│   ├── MessageBubble.tsx # Individual message display
│   ├── ModelPicker.tsx # LLM provider/model selection
│   └── ToolCallDisplay.tsx # Tool execution visualization
├── hooks/
│   └── useAgent.ts     # Main agent logic and state management
├── services/
│   ├── llm.ts          # LLM provider abstraction layer
│   └── tools.ts        # Tool execution service
├── types/
│   └── index.ts        # TypeScript type definitions
└── utils/
    └── constants.ts    # Configuration and constants
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Private-Aayansh/llm-agent-poc
cd llm-agent-poc
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Configuration

Before using the agent, you'll need to configure API keys:

1. **LLM Provider API Key**: 
   - OpenAI: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Anthropic: Get from [Anthropic Console](https://console.anthropic.com/)
   - Google: Get from [Google AI Studio](https://aistudio.google.com/)
   - AIPipe: Get from [AIPipe.org](https://aipipe.org/)

2. **Google Search API** (optional, for web search functionality):
   - API Key: [Google Cloud Console](https://console.developers.google.com/)
   - Search Engine ID: [Google Custom Search](https://cse.google.com/)

Click the settings button in the top-right corner to configure these keys.

## 🔧 Usage Examples

### Basic Conversation
```
User: "What's the weather like in Tokyo today?"
Agent: [Uses Google Search] → Returns current weather information
```

### Code Execution
```
User: "Calculate the fibonacci sequence for the first 10 numbers"
Agent: [Uses JavaScript execution] → Runs code and returns results
```

### AI Workflows
```
User: "Analyze the sentiment of this text: 'I love this product!'"
Agent: [Uses AI Pipeline] → Returns sentiment analysis results
```

### Complex Multi-Tool Tasks
```
User: "Search for the latest AI research papers and summarize the key findings"
Agent: [Uses Google Search] → [Uses AI Pipeline for summarization] → Returns comprehensive summary
```

## 🛡️ Security Features

- **Sandboxed Code Execution**: JavaScript runs in isolated iframe environment
- **API Key Protection**: Keys stored locally, never transmitted to unauthorized endpoints
- **Input Validation**: All user inputs and tool parameters are validated
- **Error Boundaries**: Graceful error handling prevents system crashes

## 🎯 Tool Capabilities

### Google Search Tool
- Real-time web search results
- Configurable result count
- Snippet extraction
- URL validation

### AI Workflow Tool
- Sentiment analysis
- Text summarization  
- Entity extraction
- Custom workflow support

### JavaScript Execution Tool
- Secure sandbox environment
- Console output capture
- Return value extraction
- Timeout protection (5 seconds)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

The project is configured to deploy to GitHub Pages with the base path `/llm-agent-poc/`.

## 🧪 Development

### Project Structure
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling and responsive design
- **Vite** for fast development and building
- **ESLint** for code quality and consistency

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🔮 Future Enhancements

- [ ] Add more LLM providers (Cohere, Mistral, etc.)
- [ ] Implement conversation memory and context management
- [ ] Add file upload and processing capabilities
- [ ] Integrate with more external APIs and services
- [ ] Add conversation export/import functionality
- [ ] Implement user authentication and conversation persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
