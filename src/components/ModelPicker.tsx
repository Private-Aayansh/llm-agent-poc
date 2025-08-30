import React from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { LLM_PROVIDERS } from '../utils/constants';

interface ModelPickerProps {
  selectedProvider: string;
  selectedModel: string;
  apiKey: string;
  googleApiKey: string;
  searchEngineId: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onGoogleApiKeyChange: (apiKey: string) => void;
  onSearchEngineIdChange: (id: string) => void;
}

export default function ModelPicker({
  selectedProvider,
  selectedModel,
  apiKey,
  googleApiKey,
  searchEngineId,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onGoogleApiKeyChange,
  onSearchEngineIdChange,
}: ModelPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedProviderData = LLM_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <Settings className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-neutral-700">
          {selectedProviderData?.name} - {selectedModel}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 animate-slide-up">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                LLM API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={`Enter your ${selectedProviderData?.name} API key`}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {selectedProvider === 'aipipe' && (
                <p className="text-xs text-neutral-500 mt-1">
                  Get your API key from <a href="https://aipipe.org/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">AIPipe.org</a>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Google Search API Key
              </label>
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => onGoogleApiKeyChange(e.target.value)}
                placeholder="Enter Google Search API key"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Get from <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Google Cloud Console</a>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Search Engine ID
              </label>
              <input
                type="text"
                value={searchEngineId}
                onChange={(e) => onSearchEngineIdChange(e.target.value)}
                placeholder="Enter Custom Search Engine ID"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Get from <a href="https://cse.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Google Custom Search</a>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  onProviderChange(e.target.value);
                  const provider = LLM_PROVIDERS.find(p => p.id === e.target.value);
                  if (provider) {
                    onModelChange(provider.models[0]);
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {LLM_PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {selectedProviderData?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 transition-colors duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}