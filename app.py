import os
import pathlib
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from langchain.chains import RetrievalQA
from langchain.llms.base import LLM
from langchain_community.llms import HuggingFacePipeline, Ollama
from fastapi.middleware.cors import CORSMiddleware

from document_processor import load_pdf_documents, split_documents
from vector_store import build_or_load_faiss_index, get_retriever


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str


app = FastAPI(title="Local RAG Backend", version="1.0.0")

# Enable CORS for local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global singletons created at startup
_VECTORSTORE = None
_RETRIEVER = None
_LLM: Optional[LLM] = None


def _init_local_llm() -> LLM:
    """Initialize a local LLM using either Hugging Face transformers or Ollama.

    Env vars:
    - LLM_BACKEND: "transformers" or "ollama" (default: transformers)
    - HF_MODEL_NAME: transformers model name (default: "sshleifer/tiny-gpt2")
    - OLLAMA_MODEL: ollama model name (default: "mistral")
    - LLM_DEVICE: device for transformers (e.g., "cpu" or "cuda")
    """
    backend = os.getenv("LLM_BACKEND", "transformers").lower()

    if backend == "ollama":
        model = os.getenv("OLLAMA_MODEL", "mistral")
        return Ollama(model=model)

    # Lazy import transformers only when needed
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline  # type: ignore
    except Exception as exc:
        raise RuntimeError(
            "Transformers backend selected but 'transformers' could not be imported. Install compatible versions or switch to Ollama by setting LLM_BACKEND=ollama."
        ) from exc

    # Use a more reliable model for local dev
    model_name = os.getenv("HF_MODEL_NAME", "microsoft/DialoGPT-small")
    device = 0 if os.getenv("LLM_DEVICE", "cpu") == "cuda" else -1

    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=None,
            device_map="auto" if device == 0 else None,
        )

        generate_text = pipeline(
            task="text-generation",
            model=model,
            tokenizer=tokenizer,
            device=device,
            max_new_tokens=256,
            do_sample=True,
            top_p=0.9,
            temperature=0.7,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id,
        )
    except Exception as exc:
        raise RuntimeError(f"Failed to load model {model_name}: {exc}") from exc

    return HuggingFacePipeline(pipeline=generate_text)


@app.get("/")
def root():
    return {
        "message": "RAG backend is running. Use POST /ask or open /docs.",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def startup_event():
    global _VECTORSTORE, _RETRIEVER, _LLM

    # Ensure FAISS dir exists
    pathlib.Path(os.getenv("FAISS_DIR", "faiss_index")).mkdir(parents=True, exist_ok=True)

    # Build or load vectorstore
    try:
        # Try to load existing index
        _VECTORSTORE = build_or_load_faiss_index()
    except Exception:
        # If not existing, build from PDF
        docs = load_pdf_documents()
        chunks = split_documents(docs, chunk_size_tokens=500, chunk_overlap_tokens=50)
        _VECTORSTORE = build_or_load_faiss_index(chunks)

    _RETRIEVER = get_retriever(_VECTORSTORE, k=3)
    _LLM = _init_local_llm()


@app.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    """RAG endpoint: retrieve top-k context and generate answer with local LLM.

    The answer should be grounded in the PDF contents because the retriever provides context to the LLM.
    """
    if not payload.question or not payload.question.strip():
        return AskResponse(answer="Please provide a non-empty question.")

    try:
        if not _LLM:
            return AskResponse(answer="LLM not initialized. Please check server logs.")
        
        if not _RETRIEVER:
            return AskResponse(answer="Retriever not initialized. Please check server logs.")

        chain = RetrievalQA.from_chain_type(
            llm=_LLM,
            chain_type="stuff",
            retriever=_RETRIEVER,
            return_source_documents=False,
        )

        result = chain.invoke({"query": payload.question.strip()})
        answer_text = result["result"] if isinstance(result, dict) else str(result)
        return AskResponse(answer=answer_text)
    
    except Exception as e:
        print(f"Error in ask endpoint: {e}")
        return AskResponse(answer=f"Error processing question: {str(e)}")
