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
    localStorage.removeItem("token"); // Remove o token
    router.push("/login"); // Redireciona para a página de login
  };



  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Seus Documentos</h1>
      <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Sair
        </button>

      <a
        href="/upload"
        className="inline-block mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
      >
        Enviar novo documento
      </a>

      {loading ? (
        <p>Carregando documentos...</p>
      ) : documents.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <div className="space-y-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-gray-800 p-6 rounded shadow-md space-y-2"
            >
              <p className="text-sm text-gray-400">
                Criado em: {new Date(doc.createdAt).toLocaleString()}
              </p>
              <p className="font-semibold">Texto extraído:</p>
              <pre className="whitespace-pre-wrap text-sm">{doc.extractedText}</pre>

              {doc.llmResponse && (
                <>
                  <p className="font-semibold">Resposta do LLM:</p>
                  <pre className="whitespace-pre-wrap text-sm text-green-300">
                    {doc.llmResponse}
                  </pre>
                </>
              )}

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const format = "pdf"; // ou "txt"
                    const url = `http://localhost:3003/documents/${doc.id}/download?format=${format}`;

                    const response = await axios.get(url, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      responseType: "blob", // Indica que a resposta é um arquivo binário
                    });

                    // Cria um link temporário para download
                    const blob = new Blob([response.data]);
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = `documento.${format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(downloadUrl); // Libera memória
                  } catch (error) {
                    console.error("Erro ao baixar documento:", error);
                    alert("Falha ao baixar o documento. Verifique sua autenticação.");
                  }
                }}
                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Baixar documento
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
