'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Bot, ArrowLeft, Download } from 'lucide-react';

interface Document {
  id: string;
  extractedText: string;
  llmResponse: string;
  createdAt: string;
}

export default function VisualizarDocumento() {
  const { id } = useParams();
  const router = useRouter();
  const [documento, setDocumento] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumento = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3003/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumento(response.data);
      } catch (error) {
        console.error('Erro ao buscar documento:', error);
        alert('Erro ao carregar documento. Verifique a autenticação.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocumento();
  }, [id]);

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    if (!id || !token) return;

    const downloadUrl = `http://localhost:3003/documents/${id}/download?format=pdf`;
    window.open(`${downloadUrl}?token=${token}`, '_blank');
  };

  if (loading) return <div className="text-gray-400 p-6">Carregando documento...</div>;
  if (!documento) return <div className="text-red-500 p-6">Documento não encontrado.</div>;

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
          <FileText size={28} /> Visualizar Documento
        </h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-xl text-white"
        >
          <ArrowLeft size={18} /> Voltar para a Dashboard
        </button>
      </header>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <p className="text-xs text-gray-400">
            Criado em:{' '}
            <span className="text-white font-mono">
              {new Date(documento.createdAt).toLocaleString()}
            </span>
          </p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 transition rounded-lg text-white"
          >
            <Download size={16} /> Baixar PDF original
          </button>
        </div>

        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-300 mb-2">
            <FileText size={18} /> Texto extraído:
          </h2>
          <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto text-sm text-gray-200 border border-gray-700">
            <pre className="whitespace-pre-wrap">{documento.extractedText}</pre>
          </div>
        </section>

        {documento.llmResponse && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-2">
              <Bot size={18} /> Resposta do LLM:
            </h2>
            <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto text-sm text-green-400 border border-gray-700">
              <pre className="whitespace-pre-wrap">{documento.llmResponse}</pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
