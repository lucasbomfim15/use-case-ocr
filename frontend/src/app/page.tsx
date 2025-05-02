'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, form);
      router.push('/login');
    } catch (err) {
      console.error('Erro ao registrar', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">
      <div className="bg-gray-900 shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full">
        {/* Ilustração + texto */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gray-800 p-10 text-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Bem-vindo ao Meus Docs!
          </h2>
          <p className="text-gray-300 mb-8 text-sm md:text-base max-w-xs">
            Organize e acesse seus documentos com praticidade e segurança.
          </p>
          <img
            src="/imagem01.svg"
            alt="Ilustração"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Formulário */}
        <div className="p-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-6 text-center">
            Crie sua conta
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome completo"
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Senha"
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cadastrar
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">Já tem uma conta?</p>
            <Link href="/login" className="text-blue-400 font-medium hover:underline">
              Faça login aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
