'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Download, Trash } from 'lucide-react';
import DocumentViewer from '@/components/documentViewer'; 
import ConfirmModal from '@/components/ConfirmMoldal'; 

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchDocumento = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
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

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!id || !token) return;
  
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/download?format=pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
  
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'documento.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      alert('Falha ao baixar o documento. Verifique sua autenticação.');
    }
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Documento deletado com sucesso.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      alert('Erro ao deletar o documento.');
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (loading) return <div className="text-gray-400 p-6">Carregando documento...</div>;
  if (!documento) return <div className="text-red-500 p-6">Documento não encontrado.</div>;

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-8">
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
          <FileText size={28} /> Visualizar Documento
        </h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-xl text-white"
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
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 transition rounded-lg text-white"
            >
              <Download size={16} /> Baixar PDF original
            </button>
            <button
              onClick={handleDelete}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 transition rounded-lg text-white"
            >
              <Trash size={16} /> Deletar Documento
            </button>
          </div>
        </div>

        <DocumentViewer
          extractedText={documento.extractedText}
          llmResponse={documento.llmResponse}
          documentId={documento.id}
        />
      </div>
    </div>
  );
}
