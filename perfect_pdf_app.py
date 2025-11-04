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

app = FastAPI(title="Perfect PDF-based RAG Backend", version="1.0.0")

# Enable CORS for local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store PDF content
PDF_SECTIONS = []

def load_pdf_content(pdf_path: str = "Handbook.pdf") -> List[Dict]:
    """Load and extract text content from PDF file, organizing into sections."""
    global PDF_SECTIONS
    
    if PDF_SECTIONS:
        return PDF_SECTIONS
    
    if not os.path.exists(pdf_path):
        return [{"title": "Error", "content": "PDF file not found. Please ensure Handbook.pdf is in the project directory."}]
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = pypdf.PdfReader(file)
            sections = []
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                
                if page_text.strip():
                    # Split page into sections based on common patterns
                    page_sections = split_into_sections(page_text, page_num + 1)
                    sections.extend(page_sections)
            
            PDF_SECTIONS = sections
            return PDF_SECTIONS
    except Exception as e:
        return [{"title": "Error", "content": f"Error reading PDF: {str(e)}"}]

def split_into_sections(text: str, page_num: int) -> List[Dict]:
    """Split text into meaningful sections."""
    sections = []
    
    # Common section headers
    section_patterns = [
        r'^[IVX]+\.\s+[A-Z][A-Z\s]+',  # Roman numerals
        r'^[A-Z]\.\s+[A-Z][A-Z\s]+',   # Letter sections
        r'^[0-9]+\.\s+[A-Z][A-Z\s]+',  # Numbered sections
        r'^[A-Z][A-Z\s]{10,}',         # All caps headers
    ]
    
    # Split by double newlines first
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    
    current_section = {"title": f"Page {page_num}", "content": "", "page": page_num}
    
    for paragraph in paragraphs:
        # Check if this paragraph is a section header
        is_header = False
        for pattern in section_patterns:
            if re.match(pattern, paragraph, re.MULTILINE):
                # Save previous section if it has content
                if current_section["content"].strip():
                    sections.append(current_section)
                
                # Start new section
                current_section = {
                    "title": paragraph[:100] + "..." if len(paragraph) > 100 else paragraph,
                    "content": "",
                    "page": page_num
                }
                is_header = True
                break
        
        if not is_header:
            current_section["content"] += paragraph + "\n\n"
    
    # Add the last section
    if current_section["content"].strip():
        sections.append(current_section)
    
    return sections

def search_pdf_content(question: str, pdf_sections: List[Dict]) -> str:
    """Search for relevant content in PDF sections based on question."""
    if not pdf_sections or pdf_sections[0]["title"] == "Error":
        return "I'm sorry, I cannot access the employee handbook at the moment. Please contact HR for assistance."
    
    # Convert question to search terms
    question_lower = question.lower()
    search_terms = re.findall(r'\b\w+\b', question_lower)
    
    # Remove common stop words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'what', 'how', 'when', 'where', 'why', 'who', 'which', 'tell', 'me', 'about'}
    search_terms = [term for term in search_terms if term not in stop_words and len(term) > 2]
    
    # Find most relevant sections
    relevant_sections = []
    
    for section in pdf_sections:
        title_lower = section["title"].lower()
        content_lower = section["content"].lower()
        combined_text = title_lower + " " + content_lower
        
        score = 0
        
        # Check for keyword matches in title (higher weight)
        for term in search_terms:
            if term in title_lower:
                score += 5
        
        # Check for keyword matches in content
        for term in search_terms:
            if term in content_lower:
                score += 1
        
        # Check for specific patterns based on question type
        if any(keyword in question_lower for keyword in ['policy', 'policies', 'rules', 'guidelines']):
            if any(keyword in combined_text for keyword in ['policy', 'rule', 'guideline', 'procedure', 'standard', 'requirement']):
                score += 3
        
        if any(keyword in question_lower for keyword in ['sick', 'illness', 'leave', 'absence']):
            if any(keyword in combined_text for keyword in ['sick', 'illness', 'leave', 'absence', 'medical', 'doctor']):
                score += 3
        
        if any(keyword in question_lower for keyword in ['work', 'working', 'hours', 'time']):
            if any(keyword in combined_text for keyword in ['work', 'working', 'hours', 'time', 'schedule', 'shift']):
                score += 3
        
        if any(keyword in question_lower for keyword in ['overtime', 'pay', 'salary', 'compensation']):
            if any(keyword in combined_text for keyword in ['overtime', 'pay', 'salary', 'compensation', 'wage']):
                score += 3
        
        if any(keyword in question_lower for keyword in ['benefit', 'benefits', 'insurance', 'vacation']):
            if any(keyword in combined_text for keyword in ['benefit', 'insurance', 'vacation', 'holiday', 'compensation']):
                score += 3
        
        if score > 0:
            relevant_sections.append((score, section))
    
    # Sort by relevance score
    relevant_sections.sort(key=lambda x: x[0], reverse=True)
    
    # Return top 2 most relevant sections
    if relevant_sections:
        response = "Based on the Employee Handbook:\n\n"
        
        for i, (score, section) in enumerate(relevant_sections[:2], 1):
            # Clean up the content
            clean_content = re.sub(r'\s+', ' ', section["content"]).strip()
            
            # Try to find the most relevant part of the section
            if len(clean_content) > 500:
                # Find sentences that contain search terms
                sentences = re.split(r'[.!?]+', clean_content)
                relevant_sentences = []
                
                for sentence in sentences:
                    sentence = sentence.strip()
                    if len(sentence) > 20:
                        sentence_lower = sentence.lower()
                        for term in search_terms:
                            if term in sentence_lower:
                                relevant_sentences.append(sentence)
                                break
                
                if relevant_sentences:
                    clean_content = '. '.join(relevant_sentences[:3]) + '.'
                else:
                    clean_content = clean_content[:500] + "..."
            
            response += f"{i}. **{section['title']}** (Page {section['page']}):\n"
            response += f"   {clean_content}\n\n"
        
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
        "message": "Perfect PDF-based RAG backend is running. Use POST /ask or open /docs.",
        "docs_url": "/docs",
        "health_url": "/health",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    """Perfect PDF-based endpoint that provides responses from the Handbook.pdf."""
    if not payload.question or not payload.question.strip():
        return AskResponse(answer="Please provide a non-empty question.")

    try:
        # Load PDF content
        pdf_sections = load_pdf_content()
        
        # Search for relevant content
        answer = search_pdf_content(payload.question.strip(), pdf_sections)
        
        return AskResponse(answer=answer)
    
    except Exception as e:
        print(f"Error in ask endpoint: {e}")
        return AskResponse(answer=f"Error processing question: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
