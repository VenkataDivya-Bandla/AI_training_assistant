import os
import pathlib
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str


app = FastAPI(title="Simple RAG Backend", version="1.0.0")

# Enable CORS for local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple knowledge base for responses
KNOWLEDGE_BASE = {
    "training": {
        "keywords": ["training", "learn", "course", "education", "skill", "development"],
        "response": """📚 Training Resources

Available learning paths:
• Technical Skills: Programming and tools training
• Soft Skills: Communication and leadership
• Company Culture: Values and best practices
• Role-Specific: Department training materials

Access the Learning Management System through HR portal or contact your manager for specific training schedules."""
    },
    "policies": {
        "keywords": ["policy", "policies", "rules", "guidelines", "code of conduct", "handbook"],
        "response": """📋 Company Policies

Key policies to review:
• Code of Conduct: Professional behavior standards
• Attendance Policy: Work hours and time-off procedures
• IT Security: Password requirements and data protection
• Communication Guidelines: Email and messaging etiquette

Find detailed information in your Employee Handbook or contact HR for specific questions."""
    },
    "it": {
        "keywords": ["it", "setup", "computer", "software", "tools", "technical", "helpdesk"],
        "response": """💻 IT Setup Guide

Essential development tools:
• Git: Version control system
• Node.js: JavaScript runtime
• VS Code: Code editor with extensions
• Docker: Containerization platform
• Slack: Team communication
• Jira: Project management

Contact IT Helpdesk for installation assistance and credentials."""
    },
    "meeting": {
        "keywords": ["meeting", "schedule", "calendar", "appointment", "book"],
        "response": """📅 Meeting Scheduling

How to schedule meetings:
• Use company calendar system (Outlook/Google)
• Book meeting rooms through facilities portal
• Your manager will schedule initial check-ins
• HR available for onboarding meetings

Check your welcome email for calendar access instructions."""
    },
    "team": {
        "keywords": ["team", "directory", "contact", "colleague", "manager", "buddy"],
        "response": """👥 Team Directory

Key contacts:
• Your Direct Manager: Primary point of contact
• HR Representative: Onboarding and policies
• IT Support: Technical assistance
• Buddy/Mentor: Peer support during onboarding

Check the employee directory in your welcome packet."""
    },
    "faq": {
        "keywords": ["faq", "question", "help", "what", "how", "when", "where"],
        "response": """❓ FAQ

Common questions:
• When do I get access to systems? Usually within 24-48 hours
• How do I request time off? Through HR portal
• Who do I contact for IT issues? IT Helpdesk
• When is my first team meeting? Your manager will schedule

Refer to Employee Handbook for comprehensive answers."""
    }
}

def find_best_response(question: str) -> str:
    """Find the best response based on keyword matching."""
    question_lower = question.lower()
    
    # Check each category for keyword matches
    best_match = None
    max_matches = 0
    
    for category, data in KNOWLEDGE_BASE.items():
        matches = sum(1 for keyword in data["keywords"] if keyword in question_lower)
        if matches > max_matches:
            max_matches = matches
            best_match = category
    
    if best_match:
        return KNOWLEDGE_BASE[best_match]["response"]
    
    # Default response if no specific match
    return """🤖 AI Training Assistant

I'm here to help with your onboarding! You can ask me about:
• Company policies and procedures
• IT setup and tools
• Training resources and schedules
• Meeting arrangements
• Team directory and contacts
• Frequently asked questions

What would you like to know more about?"""


@app.get("/")
def root():
    return {
        "message": "Simple RAG backend is running. Use POST /ask or open /docs.",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    """Simple endpoint that provides responses based on keyword matching."""
    if not payload.question or not payload.question.strip():
        return AskResponse(answer="Please provide a non-empty question.")

    try:
        answer = find_best_response(payload.question.strip())
        return AskResponse(answer=answer)
    
    except Exception as e:
        print(f"Error in ask endpoint: {e}")
        return AskResponse(answer=f"Error processing question: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
