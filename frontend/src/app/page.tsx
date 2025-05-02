// src/app/register/page.tsx
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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="border p-2" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Senha" className="border p-2" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Cadastrar</button>
      </form>

      <div className="text-center">
        <p className="text-gray-600 mb-2 mt-3">Já tem uma conta?</p>
        <Link 
          href="/login" 
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          Faça login aqui
        </Link>
      </div>
    </div>
  );
}
