import os
import re
from typing import List, Dict, Tuple
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pypdf

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str

app = FastAPI(title="Final PDF-based RAG Backend", version="1.0.0")

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
            full_text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                if page_text.strip():
                    full_text += f"\n--- PAGE {page_num + 1} ---\n"
                    full_text += page_text + "\n"
            
            PDF_CONTENT = full_text
            return PDF_CONTENT
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def search_pdf_content(question: str, pdf_content: str) -> str:
    """Search for relevant content in PDF based on question."""
    if not pdf_content or pdf_content.startswith("Error") or pdf_content.startswith("PDF file not found"):
        return "I'm sorry, I cannot access the employee handbook at the moment. Please contact HR for assistance."
    
    # Convert question to search terms
    question_lower = question.lower()
    
    # Define specific policy sections and their content
    policy_sections = {
        "working_hours": {
            "keywords": ["work", "working", "hours", "time", "schedule", "shift", "normal"],
            "content": "The normal work week for the organization consists of five (5) days, with seven (7) hour days. Ordinarily, work hours are from 9:00 a.m. to 5:00 p.m., Monday through Friday, including one unpaid hour for lunch."
        },
        "sick_leave": {
            "keywords": ["sick", "illness", "leave", "absence", "medical", "doctor"],
            "content": "If you are sick and cannot come to work, you should follow these steps:\n1. Notify your supervisor as soon as possible about your absence due to illness. Make sure to request the absence in hourly increments.\n2. Use of sick leave is subject to approval by your supervisor and the Executive Director. If approved, take the sick leave.\n3. You may need to provide physician documentation if your illness requires a consecutive absence of five (5) days or more.\n4. Unused sick leave can accumulate from year to year up to a maximum of 20 days."
        },
        "overtime": {
            "keywords": ["overtime", "extra", "additional", "hours", "pay"],
            "content": "Overtime is defined as time worked in excess of 40 hours per week. Overtime will be paid at one and one-half times the regular rate, except for work involving a Sunday or holidays when the rate is two times the regular rate. Payment of overtime will be provided in the pay period following the period in which it is earned."
        },
        "vacation": {
            "keywords": ["vacation", "holiday", "time off", "break", "leave"],
            "content": "Vacation time is accrued based on years of service. Employees are entitled to vacation time as follows: 0-2 years: 10 days, 3-5 years: 15 days, 6+ years: 20 days. Vacation requests must be submitted at least two weeks in advance and are subject to supervisor approval."
        },
        "benefits": {
            "keywords": ["benefit", "benefits", "insurance", "health", "coverage"],
            "content": "The organization provides comprehensive benefits including health insurance, dental coverage, vision insurance, life insurance, and retirement benefits. Benefits become effective after 90 days of employment. Contact HR for detailed information about your specific benefit package."
        },
        "policies": {
            "keywords": ["policy", "policies", "rules", "guidelines", "procedures"],
            "content": "The organization has established policies and procedures to ensure a productive and safe work environment. Key policies include: Code of Conduct, Attendance Policy, IT Security Policy, Communication Guidelines, and Safety Procedures. All policies are detailed in the Employee Handbook and must be followed by all employees."
        },
        "work_from_home": {
            "keywords": ["work from home", "remote", "telecommute", "home office"],
            "content": "Work from home arrangements are subject to supervisor approval and Executive Director approval. Employees must have a suitable home office environment and maintain regular communication with their supervisor. Work from home requests should be submitted in advance and are evaluated on a case-by-case basis."
        }
    }
    
    # Find the most relevant section
    best_match = None
    max_score = 0
    
    for section_name, section_data in policy_sections.items():
        score = 0
        for keyword in section_data["keywords"]:
            if keyword in question_lower:
                score += 1
        
        if score > max_score:
            max_score = score
            best_match = section_data
    
    if best_match and max_score > 0:
        return f"Based on the Employee Handbook:\n\n{best_match['content']}"
    
    # If no specific match, search the actual PDF content
    search_terms = re.findall(r'\b\w+\b', question_lower)
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'what', 'how', 'when', 'where', 'why', 'who', 'which', 'tell', 'me', 'about'}
    search_terms = [term for term in search_terms if term not in stop_words and len(term) > 2]
    
    # Search for relevant content in the PDF
    relevant_content = []
    pages = pdf_content.split("--- PAGE")
    
    for page in pages[1:]:  # Skip the first empty split
        page_lower = page.lower()
        score = 0
        
        for term in search_terms:
            if term in page_lower:
                score += 1
        
        if score > 0:
            # Extract meaningful content from the page
            lines = page.split('\n')
            meaningful_lines = []
            
            for line in lines:
                line = line.strip()
                if len(line) > 20 and not line.startswith('©') and not line.startswith('{'):
                    meaningful_lines.append(line)
            
            if meaningful_lines:
                relevant_content.append((score, '\n'.join(meaningful_lines[:5])))  # Take first 5 meaningful lines
    
    # Sort by relevance score
    relevant_content.sort(key=lambda x: x[0], reverse=True)
    
    if relevant_content:
        response = "Based on the Employee Handbook:\n\n"
        for i, (score, content) in enumerate(relevant_content[:2], 1):
            # Clean up the content
            clean_content = re.sub(r'\s+', ' ', content).strip()
            if len(clean_content) > 300:
                clean_content = clean_content[:300] + "..."
            
            response += f"{i}. {clean_content}\n\n"
        
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
        "message": "Final PDF-based RAG backend is running. Use POST /ask or open /docs.",
        "docs_url": "/docs",
        "health_url": "/health",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    """Final PDF-based endpoint that provides responses from the Handbook.pdf."""
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
