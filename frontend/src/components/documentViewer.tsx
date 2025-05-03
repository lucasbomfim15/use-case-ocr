'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface DocumentViewerProps {
  extractedText: string;
  llmResponse: string;
  documentId?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  extractedText,
  llmResponse,
  documentId,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/ask`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(response.data.response);
    } catch (error) {
      console.error('Erro ao perguntar para LLM:', error);
      setAnswer('Erro ao obter resposta da LLM.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-900 rounded-xl shadow-md text-gray-200">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-blue-300">📄 Texto OCR Formatado</h2>
        <div className="prose max-w-none prose-invert">
          <ReactMarkdown>{extractedText}</ReactMarkdown>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-purple-300">🤖 Resumo (LLM)</h2>
        <div className="prose max-w-none prose-invert text-green-400">
          <ReactMarkdown>{llmResponse}</ReactMarkdown>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">💬 Tem alguma dúvida? Faça uma pergunta sobre o documento:</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={handleAsk}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-md text-white"
            disabled={loading}
          >
            {loading ? 'Consultando...' : 'Perguntar'}
          </button>
        </div>
        {answer && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-700 text-green-300">
            <strong>Resposta:</strong>
            <div className="mt-2 prose prose-invert">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
