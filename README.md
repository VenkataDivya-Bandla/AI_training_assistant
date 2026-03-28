# RAG AI Training Assistant for Employee Onboarding

## 🚀 Overview
An AI-powered onboarding and training platform that helps new employees learn through interactive modules and real-time query resolution using Retrieval-Augmented Generation (RAG).

## ✨ Features
- AI-based document search and question answering
- Real-time conversational interface
- Employee training progress tracking
- HR dashboard for managing training content
- Speech-to-text support using Whisper

## 🛠 Tech Stack
- FastAPI (Backend)
- React.js (Frontend)
- LangChain (RAG pipelines)
- Ollama (LLM)
- Whisper (Speech processing)

## ⚙️ How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
###Frontend
cd frontend
npm install
npm run dev
