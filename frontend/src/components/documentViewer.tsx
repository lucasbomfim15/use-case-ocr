import React from 'react';
import ReactMarkdown from 'react-markdown';

interface DocumentViewerProps {
  extractedText: string;
  llmResponse: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ extractedText, llmResponse }) => {
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
    </div>
  );
};

export default DocumentViewer;
