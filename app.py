import os
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pypdf
from langchain_ollama import OllamaLLM
import requests
import sqlalchemy
import uvicorn

# ------------------------------------------------
# FastAPI initialization
# ------------------------------------------------
app = FastAPI(title="Ollama Semantic RAG Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# Request / Response Models
# ------------------------------------------------
class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str

# ------------------------------------------------
# Model & Embedding Setup
# ------------------------------------------------
LLM = None
EMBED_MODEL = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
CHUNKS = []
CHUNK_EMBEDDINGS = None

# ------------------------------------------------
# Ollama Helpers
# ------------------------------------------------
def check_ollama_connection():
    try:
        response = requests.get("http://localhost:11434", timeout=3)
        return response.status_code == 200
    except:
        return False

def initialize_ollama():
    global LLM
    try:
        if check_ollama_connection():
            LLM = OllamaLLM(model="llama2", base_url="http://localhost:11434")
            LLM.generate(["Say OK"])
            print("✅ Ollama connection established successfully")
            return True
        else:
            print("❌ Ollama server not running")
            return False
    except Exception as e:
        print(f"❌ Ollama init failed: {e}")
        return False

# ------------------------------------------------
# PDF Loader
# ------------------------------------------------
def load_pdf_chunks(pdf_path="Handbook.pdf", chunk_size=1000):
    global CHUNKS, CHUNK_EMBEDDINGS

    current_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(current_dir, pdf_path)

    if not os.path.exists(pdf_path):
        print(f"❌ PDF not found: {pdf_path}")
        CHUNKS = []
        CHUNK_EMBEDDINGS = None
        return False

    print(f"📘 Loading PDF: {pdf_path}")
    local_chunks, local_embeddings = [], []

    try:
        with open(pdf_path, "rb") as file:
            pdf = pypdf.PdfReader(file)
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if not text:
                    continue
                for i in range(0, len(text), chunk_size):
                    chunk = text[i : i + chunk_size]
                    local_chunks.append((chunk, page_num + 1))
                    emb = EMBED_MODEL.encode(chunk)
                    local_embeddings.append(emb)

        CHUNKS = local_chunks
        CHUNK_EMBEDDINGS = np.array(local_embeddings)
        print(f"✅ Loaded {len(CHUNKS)} chunks")
        return True
    except Exception as e:
        print(f"❌ Error loading PDF: {e}")
        CHUNKS = []
        CHUNK_EMBEDDINGS = None
        return False

# ------------------------------------------------
# Startup
# ------------------------------------------------
@app.on_event("startup")
def startup_event():
    print("🚀 Starting backend...")
    load_pdf_chunks()
    initialize_ollama()
    print("✅ Startup complete.")

# ------------------------------------------------
# Health & Status
# ------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/status")
def system_status():
    ollama_server_ok = check_ollama_connection()
    pdf_loaded = len(CHUNKS) > 0
    return {
        "ollama_server": ollama_server_ok,
        "pdf_loaded": pdf_loaded,
        "chunks": len(CHUNKS),
    }

# ------------------------------------------------
# Main RAG endpoint
# ------------------------------------------------
@app.post("/api/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    question = payload.question.strip()
    if not question:
        return AskResponse(answer="Please ask a valid question.")

    if CHUNK_EMBEDDINGS is None or len(CHUNKS) == 0:
        return AskResponse(answer="❌ No PDF data loaded.")

    try:
        q_embed = EMBED_MODEL.encode(question).reshape(1, -1)
        sims = cosine_similarity(q_embed, CHUNK_EMBEDDINGS)[0]
        top_idx = sims.argsort()[-3:][::-1]

        context = "\n\n".join([CHUNKS[i][0] for i in top_idx])
        pages = sorted(list(set([CHUNKS[i][1] for i in top_idx])))

        prompt = (
            f"Use the context below to answer clearly.\n\n"
            f"Context (pages {pages}):\n{context}\n\nQuestion: {question}\nAnswer:"
        )

        answer = LLM.generate([prompt])
        answer_text = answer.generations[0][0].text.strip()
        return AskResponse(answer=f"{answer_text}\n\n📄 Pages: {pages}")
    except Exception as e:
        return AskResponse(answer=f"❌ Error: {e}")

# ------------------------------------------------
# Frontend Static File Serving (IMPORTANT)
# ------------------------------------------------
# Serve static files from the Vite build folder
BUILD_DIR = os.path.join(os.path.dirname(__file__), "build")

if os.path.exists(BUILD_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(BUILD_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(BUILD_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(BUILD_DIR, "index.html"))
else:
    print("⚠ Build folder not found. Run npm run build first.")

# ------------------------------------------------
# Entry Point
# ------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))