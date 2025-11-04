from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json

app = FastAPI(title="Simple RAG Quiz Generator API", version="1.0.0")

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
    questions: List[Dict[str, Any]]
    video_id: str
    total_questions: int

# Simple question generator without complex dependencies
def generate_simple_questions(video_id: str, num_questions: int = 20) -> List[Dict[str, Any]]:
    """
    Generate questions based on video ID using simple templates
    """
    # Question templates based on video content
    question_templates = {
        'dQw4w9WgXcQ': [  # Git Fundamentals
            {'q': 'What command initializes a new Git repository?', 'options': ['git init', 'git start', 'git new', 'git create'], 'a': 0},
            {'q': 'Which command stages changes for commit?', 'options': ['git push', 'git add', 'git stage', 'git include'], 'a': 1},
            {'q': 'What file lists patterns to ignore in Git?', 'options': ['.gitignore', 'git.ignore', 'ignore.txt', '.git'], 'a': 0},
            {'q': 'Command to view commit history?', 'options': ['git history', 'git commits', 'git log', 'git show'], 'a': 2},
            {'q': 'Create a new branch?', 'options': ['git new branch', 'git branch', 'git create', 'git checkout -b'], 'a': 1},
            {'q': 'Switch to another branch?', 'options': ['git move', 'git checkout', 'git switchto', 'git change'], 'a': 1},
            {'q': 'Upload local commits to remote?', 'options': ['git send', 'git upload', 'git push', 'git publish'], 'a': 2},
            {'q': 'Download latest changes from remote?', 'options': ['git pull', 'git fetch', 'git get', 'git update'], 'a': 0},
            {'q': 'Combine changes from another branch?', 'options': ['git join', 'git merge', 'git connect', 'git union'], 'a': 1},
            {'q': 'File that stores project history?', 'options': ['.git', '.history', '.repo', 'history.git'], 'a': 0}
        ],
        'scEDHsr3APg': [  # DevOps
            {'q': 'What does DevOps stand for?', 'options': ['Development Operations', 'Dev Operations', 'Development and Operations', 'Device Operations'], 'a': 2},
            {'q': 'What is continuous integration?', 'options': ['Building software once', 'Merging code frequently', 'Testing once', 'Deploying once'], 'a': 1},
            {'q': 'Which tool is commonly used for containerization?', 'options': ['Jenkins', 'Docker', 'Git', 'Python'], 'a': 1},
            {'q': 'What is infrastructure as code?', 'options': ['Writing code in infrastructure', 'Managing infrastructure through code', 'Infrastructure programming', 'Code infrastructure'], 'a': 1},
            {'q': 'What is the main goal of DevOps?', 'options': ['Reduce costs', 'Improve collaboration', 'Increase security', 'Simplify coding'], 'a': 1},
            {'q': 'Which practice involves automated testing?', 'options': ['Manual testing', 'Continuous testing', 'Random testing', 'No testing'], 'a': 1},
            {'q': 'What is version control used for?', 'options': ['Storing passwords', 'Tracking code changes', 'Managing servers', 'Creating backups'], 'a': 1},
            {'q': 'Which is a DevOps tool?', 'options': ['Microsoft Word', 'Jenkins', 'Photoshop', 'Calculator'], 'a': 1},
            {'q': 'What does CI/CD stand for?', 'options': ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Central Integration/Central Deployment', 'Complete Integration/Complete Deployment'], 'a': 0},
            {'q': 'What is monitoring in DevOps?', 'options': ['Watching movies', 'Tracking system performance', 'Reading emails', 'Playing games'], 'a': 1}
        ],
        'Z9QbYZh1YXY': [  # Team Coordination
            {'q': 'What is team coordination?', 'options': ['Working alone', 'Working together effectively', 'Avoiding meetings', 'Ignoring deadlines'], 'a': 1},
            {'q': 'Which tool helps team communication?', 'options': ['Calculator', 'Slack', 'Notepad', 'Paint'], 'a': 1},
            {'q': 'What is a standup meeting?', 'options': ['Long meeting', 'Brief daily update', 'Lunch meeting', 'Weekend meeting'], 'a': 1},
            {'q': 'What is project management?', 'options': ['Managing personal tasks', 'Planning and executing projects', 'Managing finances', 'Managing social media'], 'a': 1},
            {'q': 'What is delegation?', 'options': ['Doing everything yourself', 'Assigning tasks to others', 'Avoiding work', 'Working overtime'], 'a': 1},
            {'q': 'What is collaboration?', 'options': ['Working in isolation', 'Working together', 'Competing with others', 'Avoiding communication'], 'a': 1},
            {'q': 'What is a sprint in Agile?', 'options': ['Running fast', 'Short work period', 'Long vacation', 'Meeting room'], 'a': 1},
            {'q': 'What is a retrospective?', 'options': ['Looking forward', 'Reviewing past work', 'Planning future', 'Avoiding problems'], 'a': 1},
            {'q': 'What is task prioritization?', 'options': ['Doing random tasks', 'Ordering tasks by importance', 'Avoiding tasks', 'Doing easy tasks first'], 'a': 1},
            {'q': 'What is team alignment?', 'options': ['Standing in line', 'Working toward same goals', 'Avoiding each other', 'Competing internally'], 'a': 1}
        ],
        'HAnw168huqA': [  # Leadership
            {'q': 'What is leadership?', 'options': ['Following others', 'Guiding and influencing others', 'Avoiding responsibility', 'Working alone'], 'a': 1},
            {'q': 'What is emotional intelligence?', 'options': ['Being emotional', 'Understanding emotions', 'Avoiding emotions', 'Showing anger'], 'a': 1},
            {'q': 'What is delegation?', 'options': ['Doing everything yourself', 'Assigning tasks to others', 'Avoiding work', 'Micromanaging'], 'a': 1},
            {'q': 'What is vision in leadership?', 'options': ['Seeing clearly', 'Future direction', 'Avoiding problems', 'Looking back'], 'a': 1},
            {'q': 'What is motivation?', 'options': ['Forcing others', 'Inspiring others', 'Avoiding others', 'Ignoring others'], 'a': 1},
            {'q': 'What is decision making?', 'options': ['Avoiding choices', 'Making informed choices', 'Following others', 'Random selection'], 'a': 1},
            {'q': 'What is communication in leadership?', 'options': ['Speaking loudly', 'Clear information sharing', 'Avoiding talk', 'Writing only'], 'a': 1},
            {'q': 'What is team building?', 'options': ['Building structures', 'Creating strong teams', 'Avoiding teams', 'Breaking teams'], 'a': 1},
            {'q': 'What is conflict resolution?', 'options': ['Creating conflicts', 'Solving disagreements', 'Avoiding problems', 'Ignoring issues'], 'a': 1},
            {'q': 'What is accountability?', 'options': ['Avoiding responsibility', 'Taking responsibility', 'Blaming others', 'Ignoring mistakes'], 'a': 1}
        ],
        'bXGHT9Zz2YQ': [  # Conflict Resolution
            {'q': 'What is conflict resolution?', 'options': ['Creating conflicts', 'Solving disagreements', 'Avoiding problems', 'Ignoring issues'], 'a': 1},
            {'q': 'What is active listening?', 'options': ['Speaking loudly', 'Focused attention', 'Avoiding talk', 'Interrupting others'], 'a': 1},
            {'q': 'What is mediation?', 'options': ['Taking sides', 'Neutral facilitation', 'Avoiding problems', 'Creating problems'], 'a': 1},
            {'q': 'What is compromise?', 'options': ['Winning completely', 'Finding middle ground', 'Avoiding decisions', 'Losing completely'], 'a': 1},
            {'q': 'What is empathy?', 'options': ['Feeling sorry', 'Understanding others', 'Avoiding emotions', 'Being emotional'], 'a': 1},
            {'q': 'What is assertiveness?', 'options': ['Being aggressive', 'Confident communication', 'Avoiding talk', 'Being passive'], 'a': 1},
            {'q': 'What is negotiation?', 'options': ['Demanding everything', 'Finding mutual agreement', 'Avoiding discussion', 'Giving up'], 'a': 1},
            {'q': 'What is problem solving?', 'options': ['Avoiding problems', 'Finding solutions', 'Creating problems', 'Ignoring issues'], 'a': 1},
            {'q': 'What is communication in conflict?', 'options': ['Speaking loudly', 'Clear expression', 'Avoiding talk', 'Writing only'], 'a': 1},
            {'q': 'What is win-win solution?', 'options': ['One person wins', 'Both benefit', 'No one wins', 'Everyone loses'], 'a': 1}
        ],
        '1eH3pQX9m8c': [  # Communication
            {'q': 'What is effective communication?', 'options': ['Speaking loudly', 'Clear message delivery', 'Avoiding talk', 'Writing only'], 'a': 1},
            {'q': 'What is active listening?', 'options': ['Speaking while others talk', 'Focused attention', 'Avoiding conversation', 'Interrupting others'], 'a': 1},
            {'q': 'What is non-verbal communication?', 'options': ['Speaking', 'Body language', 'Writing', 'Reading'], 'a': 1},
            {'q': 'What is feedback?', 'options': ['Criticism only', 'Constructive input', 'Avoiding response', 'Ignoring others'], 'a': 1},
            {'q': 'What is clarity in communication?', 'options': ['Being vague', 'Clear and simple', 'Using jargon', 'Being complex'], 'a': 1},
            {'q': 'What is empathy in communication?', 'options': ['Feeling sorry', 'Understanding others', 'Avoiding emotions', 'Being emotional'], 'a': 1},
            {'q': 'What is assertiveness?', 'options': ['Being aggressive', 'Confident expression', 'Avoiding talk', 'Being passive'], 'a': 1},
            {'q': 'What is respect in communication?', 'options': ['Demanding respect', 'Showing consideration', 'Avoiding others', 'Ignoring others'], 'a': 1},
            {'q': 'What is open communication?', 'options': ['Speaking loudly', 'Honest sharing', 'Avoiding talk', 'Keeping secrets'], 'a': 1},
            {'q': 'What is effective presentation?', 'options': ['Reading slides', 'Engaging audience', 'Avoiding eye contact', 'Speaking quietly'], 'a': 1}
        ],
        'Z9QbYZh1YXY': [  # Task Prioritization
            {'q': 'What is task prioritization?', 'options': ['Doing random tasks', 'Ordering tasks by importance', 'Avoiding tasks', 'Doing easy tasks first'], 'a': 1},
            {'q': 'What is the Eisenhower Matrix?', 'options': ['A building', 'Task categorization tool', 'A person', 'A computer program'], 'a': 1},
            {'q': 'What is urgent vs important?', 'options': ['Same thing', 'Different task categories', 'Opposite concepts', 'Related tasks'], 'a': 1},
            {'q': 'What is delegation?', 'options': ['Doing everything yourself', 'Assigning tasks to others', 'Avoiding work', 'Micromanaging'], 'a': 1},
            {'q': 'What is time management?', 'options': ['Working all day', 'Efficient use of time', 'Avoiding work', 'Working randomly'], 'a': 1},
            {'q': 'What is the Pomodoro Technique?', 'options': ['Cooking method', 'Time management method', 'Exercise routine', 'Study technique'], 'a': 1},
            {'q': 'What is task breakdown?', 'options': ['Breaking things', 'Dividing large tasks', 'Avoiding tasks', 'Completing tasks'], 'a': 1},
            {'q': 'What is deadline management?', 'options': ['Ignoring deadlines', 'Meeting time limits', 'Avoiding work', 'Working randomly'], 'a': 1},
            {'q': 'What is focus?', 'options': ['Multitasking', 'Concentrated attention', 'Avoiding work', 'Working randomly'], 'a': 1},
            {'q': 'What is productivity?', 'options': ['Working slowly', 'Efficient output', 'Avoiding work', 'Working randomly'], 'a': 1}
        ],
        'l1': [  # SQL Database Fundamentals
            {'q': 'What does SQL stand for?', 'options': ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'], 'a': 0},
            {'q': 'What is a database?', 'options': ['A file', 'Organized data storage', 'A program', 'A website'], 'a': 1},
            {'q': 'What is a table in SQL?', 'options': ['Furniture', 'Data structure', 'A person', 'A building'], 'a': 1},
            {'q': 'What is a primary key?', 'options': ['Main door', 'Unique identifier', 'Password', 'Username'], 'a': 1},
            {'q': 'What is SELECT used for?', 'options': ['Creating tables', 'Retrieving data', 'Deleting data', 'Updating data'], 'a': 1},
            {'q': 'What is INSERT used for?', 'options': ['Retrieving data', 'Adding new records', 'Deleting data', 'Updating data'], 'a': 1},
            {'q': 'What is UPDATE used for?', 'options': ['Retrieving data', 'Adding data', 'Modifying existing data', 'Deleting data'], 'a': 2},
            {'q': 'What is DELETE used for?', 'options': ['Retrieving data', 'Adding data', 'Updating data', 'Removing data'], 'a': 3},
            {'q': 'What is a foreign key?', 'options': ['Main key', 'Reference to another table', 'Password', 'Username'], 'a': 1},
            {'q': 'What is normalization?', 'options': ['Making things normal', 'Database design process', 'Creating tables', 'Deleting data'], 'a': 1}
        ],
        'l2': [  # Database Design
            {'q': 'What is database design?', 'options': ['Creating websites', 'Planning database structure', 'Writing code', 'Managing users'], 'a': 1},
            {'q': 'What is normalization?', 'options': ['Making things normal', 'Reducing data redundancy', 'Creating tables', 'Deleting data'], 'a': 1},
            {'q': 'What is an Entity-Relationship diagram?', 'options': ['A picture', 'Database structure visualization', 'A table', 'A query'], 'a': 1},
            {'q': 'What is a primary key?', 'options': ['Main door', 'Unique identifier', 'Password', 'Username'], 'a': 1},
            {'q': 'What is a foreign key?', 'options': ['Main key', 'Reference to another table', 'Password', 'Username'], 'a': 1},
            {'q': 'What is an index?', 'options': ['A list', 'Performance optimization', 'A table', 'A query'], 'a': 1},
            {'q': 'What is data integrity?', 'options': ['Data size', 'Data accuracy', 'Data speed', 'Data location'], 'a': 1},
            {'q': 'What is a constraint?', 'options': ['A limitation', 'Data rule', 'A table', 'A query'], 'a': 1},
            {'q': 'What is a view?', 'options': ['A window', 'Virtual table', 'A query', 'A database'], 'a': 1},
            {'q': 'What is a stored procedure?', 'options': ['A process', 'Pre-compiled SQL', 'A table', 'A query'], 'a': 1}
        ],
        'l3': [  # Database Security
            {'q': 'What is database security?', 'options': ['Physical security', 'Protecting data', 'Creating databases', 'Managing users'], 'a': 1},
            {'q': 'What is authentication?', 'options': ['Creating accounts', 'Verifying identity', 'Managing data', 'Creating tables'], 'a': 1},
            {'q': 'What is authorization?', 'options': ['Creating accounts', 'Granting permissions', 'Managing data', 'Creating tables'], 'a': 1},
            {'q': 'What is encryption?', 'options': ['Making things smaller', 'Data protection', 'Creating tables', 'Managing users'], 'a': 1},
            {'q': 'What is a backup?', 'options': ['Going backwards', 'Data copy', 'Creating tables', 'Managing users'], 'a': 1},
            {'q': 'What is access control?', 'options': ['Creating accounts', 'Managing permissions', 'Creating tables', 'Managing data'], 'a': 1},
            {'q': 'What is a firewall?', 'options': ['A wall', 'Security barrier', 'A table', 'A query'], 'a': 1},
            {'q': 'What is auditing?', 'options': ['Creating accounts', 'Tracking activities', 'Creating tables', 'Managing data'], 'a': 1},
            {'q': 'What is data privacy?', 'options': ['Data size', 'Data protection', 'Data speed', 'Data location'], 'a': 1},
            {'q': 'What is compliance?', 'options': ['Creating rules', 'Following regulations', 'Creating tables', 'Managing users'], 'a': 1}
        ]
    }
    
    # Get questions for the video ID, fallback to Git questions
    base_questions = question_templates.get(video_id, question_templates['dQw4w9WgXcQ'])
    
    # Generate the requested number of questions
    questions = []
    for i in range(num_questions):
        base_q = base_questions[i % len(base_questions)]
        questions.append({
            'q': f"{base_q['q']} (Question {i+1})",
            'options': base_q['options'],
            'a': base_q['a']
        })
    
    return questions

@app.get("/")
async def root():
    return {"message": "Simple RAG Quiz Generator API is running"}

@app.post("/api/generate-quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate quiz questions using simple templates
    """
    try:
        questions = generate_simple_questions(request.video_id, request.num_questions)
        
        return QuizResponse(
            questions=questions,
            video_id=request.video_id,
            total_questions=len(questions)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/api/generate-quiz/{video_id}")
async def generate_quiz_by_id(video_id: str, num_questions: int = 20):
    """
    Generate quiz questions for a specific video ID
    """
    try:
        questions = generate_simple_questions(video_id, num_questions)
        
        return {
            "questions": questions,
            "video_id": video_id,
            "total_questions": len(questions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "Simple RAG Quiz Generator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)