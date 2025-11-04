import os
from typing import Optional

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document


EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
FAISS_DIR = os.getenv("FAISS_DIR", "faiss_index")
FAISS_INDEX_PATH = os.path.join(FAISS_DIR, "index")


def get_hf_embeddings() -> HuggingFaceEmbeddings:
    # Configure to run on CPU by default; can be changed via env
    model_kwargs = {"device": os.getenv("EMBEDDINGS_DEVICE", "cpu")}
    encode_kwargs = {"normalize_embeddings": True}
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs,
    )


def build_or_load_faiss_index(documents: Optional[list[Document]] = None) -> FAISS:
    """Create a FAISS index if not existing, otherwise load it from disk.

    If documents are provided and the index path does not exist, it will build
    a new index and persist it under FAISS_INDEX_PATH.
    """
    os.makedirs(FAISS_DIR, exist_ok=True)
    embeddings = get_hf_embeddings()

    if os.path.exists(FAISS_INDEX_PATH):
        return FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)

    if not documents:
        raise ValueError("No documents provided to build a new FAISS index.")

    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    return vectorstore


def get_retriever(vectorstore: FAISS, k: int = 3):
    return vectorstore.as_retriever(search_kwargs={"k": k})
