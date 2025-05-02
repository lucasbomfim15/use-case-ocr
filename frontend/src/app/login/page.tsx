// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        email,
        password: senha,
      })

      const token = response.data.access_token
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      setError('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="flex w-full max-w-5xl rounded-xl overflow-hidden bg-[#0f172a]">

        {/* Seção esquerda */}
        <div className="w-1/2 bg-[#1e293b] p-10 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">Bem-vindo de Volta!</h2>
          <p className="text-sm text-gray-300 mb-6">
            Organize e acesse seus documentos com<br />praticidade e segurança.
          </p>
          <img
            src="/imagem02.svg" // Substitua pelo caminho real da sua imagem
            alt="Ilustração"
            className="w-3/4 max-w-sm h-auto"
          />
        </div>

        {/* Seção direita */}
        <form
          onSubmit={handleLogin}
          className="w-1/2 p-10 flex flex-col justify-center bg-[#0f172a]"
        >
          <h1 className="text-2xl font-bold text-blue-500 mb-6 text-center">Login</h1>

          {error && (
            <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full p-2 mb-6 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white"
          >
            Entrar
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Ainda não tem uma conta?{' '}
            <Link href="/" className="text-blue-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
