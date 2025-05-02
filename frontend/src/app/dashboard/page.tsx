'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  imageUrl: string;
  extractedText: string;
  llmResponse: string;
  createdAt: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3003/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este documento?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3003/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } catch (error) {
        console.error("Erro ao deletar documento:", error);
        alert("Não foi possível deletar o documento.");
      }
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400">📄 Seus Documentos</h1>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 cursor-pointer"
          >
            🔒 Sair
          </button>
          <a
            href="/upload"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 cursor-pointer"
          >
            ➕ Enviar novo documento
          </a>
        </div>
      </header>

      {loading ? (
        <p className="text-gray-400">Carregando documentos...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-400">Nenhum documento encontrado.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition duration-300"
            >
              <p className="text-xs text-gray-400 mb-2">
                Criado em:{" "}
                <span className="text-white font-mono">
                  {new Date(doc.createdAt).toLocaleString()}
                </span>
              </p>

              <div className="mb-4">
                <p className="font-semibold text-blue-300 mb-1">📝 Texto extraído:</p>
                <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  {doc.extractedText}
                </pre>
              </div>

              {doc.llmResponse && (
                <div className="mb-4">
                  <p className="font-semibold text-purple-300 mb-1">🤖 Resposta do LLM:</p>
                  <pre className="whitespace-pre-wrap text-sm text-green-400 bg-gray-900 p-3 rounded-lg overflow-x-auto">
                    {doc.llmResponse}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap items-center mt-2 gap-4">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const format = "pdf";
                      const url = `http://localhost:3003/documents/${doc.id}/download?format=${format}`;

                      const response = await axios.get(url, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        responseType: "blob",
                      });

                      const blob = new Blob([response.data]);
                      const downloadUrl = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = downloadUrl;
                      link.download = `documento.${format}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(downloadUrl);
                    } catch (error) {
                      console.error("Erro ao baixar documento:", error);
                      alert("Falha ao baixar o documento. Verifique sua autenticação.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition duration-200 cursor-pointer"
                >
                  ⬇️ Baixar documento
                </button>

                <button
                  onClick={() => router.push(`/visualizar/${doc.id}`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition duration-200 cursor-pointer"
                >
                  🔍 Visualizar documento
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-sm transition duration-200 cursor-pointer ml-auto"
                >
                  🗑️ Deletar documento
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
