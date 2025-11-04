import os
import re
from typing import List, Dict
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pypdf

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str

app = FastAPI(title="PDF-based RAG Backend", version="1.0.0")

# Enable CORS for local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store PDF content
PDF_CONTENT = ""

def load_pdf_content(pdf_path: str = "Handbook.pdf") -> str:
    """Load and extract text content from PDF file."""
    global PDF_CONTENT
    
    if PDF_CONTENT:
        return PDF_CONTENT
    
    if not os.path.exists(pdf_path):
        return "PDF file not found. Please ensure Handbook.pdf is in the project directory."
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = pypdf.PdfReader(file)
            text_content = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text() + "\n"
            
            PDF_CONTENT = text_content
            return PDF_CONTENT
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def search_pdf_content(question: str, pdf_content: str) -> str:
    """Search for relevant content in PDF based on question."""
    if not pdf_content or pdf_content.startswith("Error") or pdf_content.startswith("PDF file not found"):
        return "I'm sorry, I cannot access the employee handbook at the moment. Please contact HR for assistance."
    
    # Convert question to search terms
    question_lower = question.lower()
    search_terms = re.findall(r'\b\w+\b', question_lower)
    
    # Split content into paragraphs
    paragraphs = [p.strip() for p in pdf_content.split('\n\n') if p.strip()]
    
    # Find most relevant paragraphs
    relevant_paragraphs = []
    
    for paragraph in paragraphs:
        paragraph_lower = paragraph.lower()
        score = 0
        
        # Check for keyword matches
        for term in search_terms:
            if term in paragraph_lower:
                score += 1
        
        # Check for specific patterns
        if any(keyword in question_lower for keyword in ['sick', 'illness', 'sick leave', 'medical', 'health']):
            if any(keyword in paragraph_lower for keyword in ['sick', 'illness', 'medical', 'leave', 'absence', 'health']):
                score += 3
        
        if any(keyword in question_lower for keyword in ['policy', 'policies', 'rules', 'guidelines']):
            if any(keyword in paragraph_lower for keyword in ['policy', 'rule', 'guideline', 'procedure']):
                score += 2
        
        if any(keyword in question_lower for keyword in ['training', 'learn', 'course', 'education']):
            if any(keyword in paragraph_lower for keyword in ['training', 'learning', 'course', 'education', 'development']):
                score += 2
        
        if any(keyword in question_lower for keyword in ['it', 'computer', 'software', 'technical']):
            if any(keyword in paragraph_lower for keyword in ['it', 'computer', 'software', 'technical', 'system']):
                score += 2
        
        if any(keyword in question_lower for keyword in ['meeting', 'schedule', 'calendar']):
            if any(keyword in paragraph_lower for keyword in ['meeting', 'schedule', 'calendar', 'appointment']):
                score += 2
        
        if score > 0:
            relevant_paragraphs.append((score, paragraph))
    
    # Sort by relevance score
    relevant_paragraphs.sort(key=lambda x: x[0], reverse=True)
    
    # Return top 3 most relevant paragraphs
    if relevant_paragraphs:
        top_paragraphs = relevant_paragraphs[:3]
        response = "Based on the Employee Handbook:\n\n"
        
        for i, (score, paragraph) in enumerate(top_paragraphs, 1):
            # Clean up the paragraph
            clean_paragraph = re.sub(r'\s+', ' ', paragraph).strip()
            if len(clean_paragraph) > 200:
                clean_paragraph = clean_paragraph[:200] + "..."
            
            response += f"{i}. {clean_paragraph}\n\n"
        
        return response
    else:
        # Fallback response if no specific content found
        return f"""I couldn't find specific information about "{question}" in the Employee Handbook. 

Here are some general resources:
• Contact HR for policy questions
• Check the Employee Handbook for detailed procedures
• Reach out to your manager for immediate assistance
• IT Helpdesk for technical issues

Would you like me to help you with something else?"""

@app.get("/")
def root():
    return {
        "message": "PDF-based RAG backend is running. Use POST /ask or open /docs.",
        "docs_url": "/docs",
        "health_url": "/health",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    """PDF-based endpoint that provides responses from the Handbook.pdf."""
    if not payload.question or not payload.question.strip():
        return AskResponse(answer="Please provide a non-empty question.")

    try:
        # Load PDF content
        pdf_content = load_pdf_content()
        
        # Search for relevant content
        answer = search_pdf_content(payload.question.strip(), pdf_content)
        
        return AskResponse(answer=answer)
    
    except Exception as e:
        print(f"Error in ask endpoint: {e}")
        return AskResponse(answer=f"Error processing question: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
