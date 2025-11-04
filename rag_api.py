from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from rag_quiz_generator_simple import generate_quiz_questions

app = FastAPI(title="RAG Quiz Generator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4028",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuizRequest(BaseModel):
    video_id: str
    num_questions: int = 20

class QuizResponse(BaseModel):
    questions: List[Dict[str, Any]]
    video_id: str
    total_questions: int

# Root endpoint
@app.get("/")
async def root():
    return {"message": "RAG Quiz Generator API is running"}

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "RAG Quiz Generator"}

# Quiz generation endpoint (POST)
@app.post("/api/generate_quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        questions = generate_quiz_questions(request.video_id, request.num_questions)
        return QuizResponse(
            questions=questions,
            video_id=request.video_id,
            total_questions=len(questions)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

# Quiz generation endpoint (GET by video_id)
@app.get("/api/generate_quiz/{video_id}")
async def generate_quiz_by_id(video_id: str, num_questions: int = 20):
    try:
        questions = generate_quiz_questions(video_id, num_questions)
        return {
            "questions": questions,
            "video_id": video_id,
            "total_questions": len(questions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

# Main runner
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
