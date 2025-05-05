
# use-case-ocr 🧠📄

Aplicação fullstack desenvolvida como parte de um case técnico, que permite o **upload de documentos**, extração automática de dados via **OCR (Reconhecimento Óptico de Caracteres)**, e gerenciamento de arquivos por meio de uma **dashboard moderna**.

## ✨ Funcionalidades

- Upload de imagens/documentos via dashboard
- Extração automática de texto usando OCR com IA
- Visualização e download de documentos processados
- Autenticação de usuários (signup/login com JWT)
- API RESTful com NestJS + PostgreSQL (Prisma ORM)
- Frontend com React + Next.js + Tailwind
- Deploy automatizado com Railway

## 🧱 Estrutura do Projeto

```
use-case-ocr/
├── backend/        # API com NestJS, OCR e banco de dados PostgreSQL
├── frontend/       # Dashboard com Next.js, Tailwind e chamadas à API
```

## 🚀 Tecnologias Utilizadas

### Backend
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tesseract.js](https://github.com/naptha/tesseract.js) para OCR
- JWT para autenticação
- Multer para upload de arquivos

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Axios para comunicação com API

### Infraestrutura
- [Docker](https://www.docker.com/) para banco local
- [Railway](https://railway.app/) para deploy do backend
- [Vercel](https://vercel.com/) para deploy do frontend

## 🌐 Endpoints principais

### Auth
- `POST /auth/signup` — Cadastro de usuário
- `POST /auth/login` — Login e retorno de JWT

### Documentos
- `POST /documents/upload` — Upload de imagem/documento
- `GET /documents` — Lista todos os documentos do usuário
- `GET /documents/:id` — Retorna informações detalhadas de um documento
- `GET /documents/:id/download` — Faz download do arquivo original



## 🛠️ Como rodar localmente

### Requisitos:
- Node.js 18+
- Docker + Docker Compose
- Yarn ou npm

### 1. Clone o repositório

```bash
git clone https://github.com/lucasbomfim15/use-case-ocr.git
cd use-case-ocr
```

### 2. Suba o banco de dados

```bash
docker-compose up -d
```

### 3. Rode o backend

```bash
cd backend
cp .env.example .env
yarn install
yarn prisma migrate dev
yarn start:dev
```

### 4. Rode o frontend

```bash
cd ../frontend
cp .env.example .env
yarn install
yarn dev
```

---

## 👤 Autor

Feito com 💚 por **[Lucas Bomfim do Nascimento](https://github.com/lucasbomfim15)**  
AWS Certified Cloud Practitioner | Dev Full Stack

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
