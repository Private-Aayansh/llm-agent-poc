import React from 'react';
import { Bot } from 'lucide-react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput';
import ModelPicker from './components/ModelPicker';
import Alert from './components/Alert';
import { useAgent } from './hooks/useAgent';

function App() {
  const {
    messages,
    isLoading,
    selectedProvider,
    selectedModel,
    apiKey,
    googleApiKey,
    searchEngineId,
    error,
    sendMessage,
    updateState,
    clearError,
    setGoogleApiKey,
    setSearchEngineId,
  } = useAgent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-neutral-800">
                  LLM Agent POC
                </h1>
                <p className="text-sm text-neutral-600">
                  Multi-Tool Reasoning System
                </p>
              </div>
            </div>

            <ModelPicker
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              apiKey={apiKey}
              googleApiKey={googleApiKey}
              searchEngineId={searchEngineId}
              onProviderChange={(provider) => updateState({ selectedProvider: provider })}
              onModelChange={(model) => updateState({ selectedModel: model })}
              onApiKeyChange={(apiKey) => updateState({ apiKey })}
              onGoogleApiKeyChange={setGoogleApiKey}
              onSearchEngineIdChange={setSearchEngineId}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Error Alert */}
        {error && (
          <div className="p-6 pb-0">
            <Alert
              type="error"
              title="Agent Error"
              message={error}
              onClose={clearError}
            />
          </div>
        )}

        {/* Chat Area */}
        <Chat messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <div className="border-t border-neutral-200 bg-white/80 backdrop-blur-sm p-6">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent_50%)]"></div>
      </div>
    </div>
  );
}

export default App;