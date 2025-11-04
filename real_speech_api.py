#!/usr/bin/env python3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from real_speech_to_text import generate_quiz_from_speech

app = FastAPI(title="Real Speech-to-Text Quiz Generator API", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4028", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    video_id: str
    num_questions: int = 20

class QuizResponse(BaseModel):
    video_id: str
    transcript: str
    questions: List[Dict[str, Any]]
    total_questions: int
    transcript_length: int
    chunks_created: int
    embeddings_shape: List[int]
    success: bool
    error: str = None

@app.get("/")
async def root():
    return {
        "message": "Real Speech-to-Text Quiz Generator API is running",
        "version": "2.0.0",
        "features": [
            "YouTube audio extraction",
            "OpenAI Whisper speech-to-text",
            "Real transcript-based question generation",
            "Intelligent caching system",
            "Fallback mechanisms"
        ]
    }

@app.post("/api/generate-quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate quiz questions using real speech-to-text from YouTube videos
    """
    try:
        print(f"🎬 Processing video: {request.video_id}")
        
        result = generate_quiz_from_speech(request.video_id, request.num_questions)
        
        if 'error' in result:
            return QuizResponse(
                video_id=request.video_id,
                transcript="",
                questions=[],
                total_questions=0,
                transcript_length=0,
                chunks_created=0,
                embeddings_shape=[],
                success=False,
                error=result['error']
            )
        
        return QuizResponse(
            video_id=result['video_id'],
            transcript=result['transcript'],
            questions=result['questions'],
            total_questions=result['total_questions'],
            transcript_length=result['transcript_length'],
            chunks_created=result['chunks_created'],
            embeddings_shape=list(result['embeddings_shape']),
            success=True
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/api/generate-quiz/{video_id}")
async def generate_quiz_by_id(video_id: str, num_questions: int = 20):
    """
    Generate quiz questions for a specific video ID using speech-to-text
    """
    try:
        print(f"🎬 Processing video: {video_id}")
        
        result = generate_quiz_from_speech(video_id, num_questions)
        
        return {
            "video_id": result['video_id'],
            "transcript": result.get('transcript', ''),
            "questions": result.get('questions', []),
            "total_questions": result.get('total_questions', 0),
            "transcript_length": result.get('transcript_length', 0),
            "chunks_created": result.get('chunks_created', 0),
            "embeddings_shape": list(result.get('embeddings_shape', [])),
            "success": 'error' not in result,
            "error": result.get('error', None)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint with system status
    """
    openai_key_status = "✅ SET" if os.getenv('OPENAI_API_KEY') else "❌ NOT SET"
    
    return {
        "status": "healthy",
        "service": "Real Speech-to-Text Quiz Generator",
        "version": "2.0.0",
        "openai_api_key": openai_key_status,
        "features": {
            "youtube_extraction": "✅ Active",
            "speech_to_text": "✅ Active",
            "question_generation": "✅ Active",
            "caching": "✅ Active",
            "fallback_system": "✅ Active"
        }
    }

@app.get("/api/test/{video_id}")
async def test_video_processing(video_id: str):
    """
    Test endpoint to check video processing without generating full quiz
    """
    try:
        from real_speech_to_text import real_speech_generator
        
        # Test audio extraction
        audio_file = real_speech_generator.extract_youtube_audio(video_id)
        
        if audio_file:
            # Test speech-to-text
            transcript = real_speech_generator.speech_to_text(audio_file)
            
            return {
                "video_id": video_id,
                "audio_extraction": "✅ Success",
                "audio_file": audio_file,
                "speech_to_text": "✅ Success" if transcript else "❌ Failed",
                "transcript_length": len(transcript) if transcript else 0,
                "transcript_preview": transcript[:200] + "..." if transcript and len(transcript) > 200 else transcript
            }
        else:
            return {
                "video_id": video_id,
                "audio_extraction": "❌ Failed",
                "error": "Could not extract audio from YouTube video"
            }
            
    except Exception as e:
        return {
            "video_id": video_id,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Real Speech-to-Text Quiz Generator API...")
    print("📋 Features:")
    print("  ✅ YouTube audio extraction")
    print("  ✅ OpenAI Whisper speech-to-text")
    print("  ✅ Real transcript-based questions")
    print("  ✅ Intelligent caching")
    print("  ✅ Robust fallback system")
    print("\n🌐 API will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
