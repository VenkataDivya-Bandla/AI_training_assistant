import os
from typing import List

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document


DEFAULT_PDF_PATH = os.getenv("HANDBOOK_PDF_PATH", "Handbook.pdf")


def load_pdf_documents(pdf_path: str = DEFAULT_PDF_PATH) -> List[Document]:
    """Load a PDF file and return LangChain Document objects, one per page.

    Parameters
    ----------
    pdf_path: str
        Path to the PDF file to load.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(
            f"PDF not found at '{pdf_path}'. Place 'Handbook.pdf' in the project root or set HANDBOOK_PDF_PATH."
        )

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    return docs


def split_documents(documents: List[Document], chunk_size_tokens: int = 500, chunk_overlap_tokens: int = 50) -> List[Document]:
    """Split documents into overlapping chunks approximating token sizes using character splitter.

    We approximate 1 token ~= 4 characters for most English text. This is a heuristic
    acceptable for classical chunking when the exact tokenizer isn't available.
    """
    approx_chars_per_token = 4
    chunk_size_chars = chunk_size_tokens * approx_chars_per_token
    chunk_overlap_chars = chunk_overlap_tokens * approx_chars_per_token

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size_chars,
        chunk_overlap=chunk_overlap_chars,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )
    return splitter.split_documents(documents)
