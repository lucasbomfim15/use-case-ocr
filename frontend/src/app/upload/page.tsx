'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Erro ao fazer upload. Verifique o arquivo e tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          📤 Enviar Novo Documento
        </h1>

        <input
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          onChange={handleFileChange}
          className="block w-full p-2 bg-gray-800 rounded-lg"
        />
        <p className="text-sm text-gray-400 mt-1">
  Formatos aceitos: <span className="font-medium text-white">PNG, JPG</span>.
  PDFs ainda não são suportados.
</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg disabled:opacity-50 transition w-full"
          >
            {uploading ? 'Enviando...' : 'Enviar Documento'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition w-full"
          >
            Cancelar
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default UploadPage;
