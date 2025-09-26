"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableModels, setAvailableModels] = useState<any>(null);

  const loadAvailableModels = async () => {
    try {
      const response = await fetch("/api/gemini/models");
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data);
      }
    } catch (err) {
      console.error("Erro ao carregar modelos:", err);
    }
  };

  const testDeepSeekAPI = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      // Criar um proxy através de uma API route do Next.js para evitar problemas de CORS
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message || "Olá!"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Teste da API Google Gemini 2.5 Flash-Lite
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Configuração da Requisição
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Mensagem para enviar:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={testDeepSeekAPI}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? "Enviando..." : "Testar API"}
            </button>
            
            <button
              onClick={loadAvailableModels}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Ver Modelos Disponíveis
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">Erro:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="text-green-800 font-medium mb-2">Resposta da API:</h3>
            <div className="text-green-700 whitespace-pre-wrap">{response}</div>
          </div>
        )}

        {availableModels && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-blue-800 font-medium mb-2">Modelos Disponíveis:</h3>
            <div className="text-blue-700">
              <p><strong>Total de modelos:</strong> {availableModels.totalModels}</p>
              <p><strong>Modelos Gemini:</strong> {availableModels.geminiCount}</p>
              {availableModels.geminiModels.length > 0 && (
                <div className="mt-2">
                  <p><strong>Modelos Gemini disponíveis:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {availableModels.geminiModels.map((model: any, index: number) => (
                      <li key={index} className="text-sm">
                        {model.name} - {model.displayName || 'Sem nome'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
}
