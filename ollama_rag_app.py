import logging
import json
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# LangChain/Ollama imports
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaLLM
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.output_parsers import PydanticOutputParser # <-- CORRECTED
from langchain_core.prompts import PromptTemplate # <-- CORRECTED (if using PromptTemplate)

# --------------------------------------------------
# 🌐 FastAPI setup
# --------------------------------------------------
app = FastAPI(title="Ollama RAG Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ollama_rag_app")

# --------------------------------------------------
# ⚙️ Initialize the Ollama model and embeddings
# --------------------------------------------------
try:
    # Ensure Ollama is running locally before starting the server
    llm = OllamaLLM(model="mistral")
    embedding_model = OllamaEmbeddings(model="mistral")
    logger.info("✅ Ollama model 'mistral' initialized successfully.")
except Exception as e:
    logger.error(f"❌ Failed to initialize Ollama. Ensure Ollama is running and 'mistral' is pulled: {e}")
    # The application will start, but the LLM endpoints will fail if Ollama is down.

# --------------------------------------------------
# 📘 Structured Output Models (Pydantic)
# --------------------------------------------------
class QuizQuestion(BaseModel):
    q: str = Field(..., description="The multiple-choice question text.")
    options: List[str] = Field(..., description="A list of 4 distinct answer options, one of which is the correct answer.")
    a: int = Field(..., description="The 0-based index (0, 1, 2, or 3) of the correct answer within the options list.")

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

# Initialize the parser for structured output
quiz_parser = PydanticOutputParser(pydantic_object=QuizResponse)
format_instructions = quiz_parser.get_format_instructions()


# --------------------------------------------------
# 📘 Request models
# --------------------------------------------------
class AskRequest(BaseModel):
    question: str
    context: str

class QuizRequest(BaseModel):
    context: str
    num_questions: int = 20
    video_id: Optional[str] = None

# --------------------------------------------------
# 🧠 Helper: Build retriever from context
# --------------------------------------------------
def create_retriever_from_context(context: str):
    """Splits context into chunks, embeds them, and creates a FAISS retriever."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(context)
    documents = [Document(page_content=c) for c in chunks]
    vector_store = FAISS.from_documents(documents, embedding_model)
    return vector_store.as_retriever()

# --------------------------------------------------
# 🔹 Root routes
# --------------------------------------------------
@app.get("/health")
@app.get("/api/health")
def health_check():
    """Basic health check."""
    return {"status": "ok"}

@app.get("/")
def root():
    """Welcome message."""
    return {"message": "✅ Ollama RAG API is running!"}

# --------------------------------------------------
# 💬 /ask endpoint
# --------------------------------------------------
@app.post("/ask")
async def ask_question(request: AskRequest):
    """
    Ask a question based on the given context using RAG (Retrieval Augmented Generation).
    """
    try:
        retriever = create_retriever_from_context(request.context)
        retrieved_docs = retriever.get_relevant_documents(request.question)

        combined_context = "\n".join([d.page_content for d in retrieved_docs])
        prompt = f"Answer the question based on context:\n\n{combined_context}\n\nQuestion: {request.question}"

        result = llm.invoke(prompt)
        return {"answer": result}
    except Exception as e:
        logger.error(f"❌ Error in /ask: {e}")
        # Use str(e) to ensure the detail is serializable
        raise HTTPException(status_code=500, detail=str(e))

# --------------------------------------------------
# 📝 POST /api/generate_quiz endpoint
# --------------------------------------------------
@app.post("/api/generate_quiz")
async def generate_quiz(request: QuizRequest):
    """
    Generates structured multiple-choice quiz questions based on a given context (via POST body).
    """
    try:
        question_prompt = f"""
        You are an expert quiz generator. Your task is to generate {request.num_questions} multiple-choice questions 
        strictly based ONLY on the following context.
        For each question, you MUST provide 4 distinct, plausible options and the 0-based index of the correct answer.
        
        Context:
        {request.context}

        {format_instructions}
        """

        result_text = llm.invoke(question_prompt)
        
        # Parse the output into the structured QuizResponse model
        parsed_quiz: QuizResponse = quiz_parser.parse(result_text)
        
        # Return the structured data (FastAPI automatically converts Pydantic model to JSON)
        return parsed_quiz.dict()

    except Exception as e:
        logger.error(f"❌ Quiz generation failed in POST route: {e}")
        detail = f"LLM output parsing failed. Error: {str(e)}"
        raise HTTPException(status_code=500, detail=detail)


# --------------------------------------------------
# 📝 GET /api/generate_quiz/{video_id} endpoint (Placeholder)
# --------------------------------------------------
@app.get("/api/generate_quiz/{video_id}")
async def generate_quiz_by_id(video_id: str, num_questions: int = Query(20, ge=1, le=50)):
    """
    Handles the GET request to fetch a quiz by video ID. Currently uses a placeholder context.
    """
    
    # --- START PLACEHOLDER CONTEXT ---
    logger.warning(f"⚠️ Using PLACEHOLDER CONTEXT for video ID: {video_id}. Transcription logic needs to be implemented here.")
    placeholder_context = (
        f"The content of the video with ID {video_id} focuses on key concepts of "
        "DevOps, Continuous Integration, and the importance of using containerization tools "
        "like Docker for consistent environments. It also briefly covers the necessity of Git "
        "for version control and the role of automated testing in the CI/CD pipeline."
    )
    # --- END PLACEHOLDER CONTEXT ---
    
    # Structured Prompt
    question_prompt = f"""
    You are an expert quiz generator. Your task is to generate {num_questions} multiple-choice questions 
    strictly based ONLY on the following context.
    For each question, you MUST provide 4 distinct, plausible options and the 0-based index of the correct answer.

    Context:
    {placeholder_context}

    {format_instructions}
    """
    
    try:
        result_text = llm.invoke(question_prompt)
        
        # Parse the output into the structured QuizResponse model
        parsed_quiz: QuizResponse = quiz_parser.parse(result_text)
        
        # Return the structured data
        return parsed_quiz.dict()

    except Exception as e:
        logger.error(f"❌ Quiz generation failed in GET route: {e}")
        detail = f"LLM output parsing failed. Error: {str(e)}"
        raise HTTPException(status_code=500, detail=detail)

# --------------------------------------------------
# 🚀 Run this file using:
# uvicorn ollama_rag_app:app --reload --port 8001
# --------------------------------------------------