from typing import List, Dict, Any

# Lightweight, dependency-free quiz generator keyed by YouTube IDs or keywords

QUESTION_BANKS: Dict[str, List[Dict[str, Any]]] = {
    "python": [
        {"q": "What is Python?", "options": ["A compiled language", "An interpreted language", "A markup language", "A database language"], "a": 1},
        {"q": "Which keyword defines a function in Python?", "options": ["function", "def", "define", "func"], "a": 1},
        {"q": "Which data type is mutable in Python?", "options": ["tuple", "string", "list", "int"], "a": 2},
        {"q": "PEP stands for?", "options": ["Python Enhancement Proposal", "Python Extension Protocol", "Python Execution Process", "Python Error Prevention"], "a": 0},
        {"q": "Create a list?", "options": ["list()", "[]", "Both A and B", "{}"], "a": 2},
    ],
    "javascript": [
        {"q": "What is JavaScript?", "options": ["A markup language", "A programming language", "A database language", "A styling language"], "a": 1},
        {"q": "Declare a variable?", "options": ["var", "let", "const", "All of the above"], "a": 3},
        {"q": "DOM stands for?", "options": ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Markup"], "a": 0},
        {"q": "Append at end of array?", "options": ["push()", "pop()", "shift()", "unshift()"], "a": 0},
        {"q": "typeof null?", "options": ["null", "undefined", "object", "string"], "a": 2},
    ],
    "sql": [
        {"q": "SQL stands for?", "options": ["Simple Query Language", "Structured Query Language", "Standard Query Logic", "System Query Language"], "a": 1},
        {"q": "Retrieve rows command?", "options": ["INSERT", "SELECT", "UPDATE", "DELETE"], "a": 1},
        {"q": "Primary key means?", "options": ["Duplicate value", "Unique identifier", "Foreign key", "Index"], "a": 1},
        {"q": "Filter clause?", "options": ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], "a": 2},
        {"q": "JOIN purpose?", "options": ["Create table", "Combine rows across tables", "Delete data", "Update records"], "a": 1},
    ],
    "html_css": [
        {"q": "HTML stands for?", "options": ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"], "a": 0},
        {"q": "Largest heading tag?", "options": ["<h6>", "<h1>", "<head>", "<header>"], "a": 1},
        {"q": "CSS stands for?", "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], "a": 1},
        {"q": "CSS text color?", "options": ["text-color", "color", "font-color", "text-style"], "a": 1},
        {"q": "Purpose of CSS?", "options": ["Create pages", "Style and layout pages", "Add server logic", "Store data"], "a": 1},
    ],
    "cloud": [
        {"q": "AWS stands for?", "options": ["Amazon Web Services", "Advanced Web Systems", "Automated Web Solutions", "Application Web Services"], "a": 0},
        {"q": "Virtual servers service?", "options": ["S3", "EC2", "Lambda", "RDS"], "a": 1},
        {"q": "Cloud computing is?", "options": ["Local storage", "Internet-based computing services", "Only physical servers", "Offline computing"], "a": 1},
        {"q": "Cloud benefit?", "options": ["Higher cost", "Scalability and flexibility", "Limited access", "Complex setup"], "a": 1},
        {"q": "IaaS stands for?", "options": ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Information as a Service"], "a": 1},
    ],
    "dsa": [
        {"q": "Binary search time complexity?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "a": 1},
        {"q": "LIFO follows which DS?", "options": ["Queue", "Stack", "Array", "Linked List"], "a": 1},
        {"q": "O(n log n) sort?", "options": ["Bubble", "Selection", "Merge", "Insertion"], "a": 2},
        {"q": "Big-O describes?", "options": ["Code style", "Algorithm complexity", "DB design", "UI layout"], "a": 1},
        {"q": "Tree property?", "options": ["Unlimited children", "≤2 children for binary", "Unordered nodes", "No root"], "a": 1},
    ],
    "react": [
        {"q": "React is mainly for?", "options": ["Styling", "UI component rendering", "DB access", "Build tools"], "a": 1},
        {"q": "Hook for state?", "options": ["useMemo", "useState", "useRef", "useEffect"], "a": 1},
        {"q": "Key prop helps?", "options": ["Styling", "List reconciliation", "Security", "Bundling"], "a": 1},
        {"q": "Context used for?", "options": ["Local CSS", "Passing data down tree", "Routing", "Testing"], "a": 1},
        {"q": "Effect hook runs on?", "options": ["Server only", "Render/updates with deps", "CSS load", "DB write"], "a": 1},
    ],
    # Leadership families
    "leadership": [
        {"q": "Key trait of effective leadership?", "options": ["Micromanagement", "Vision and inspiration", "Avoiding decisions", "Individual focus"], "a": 1},
        {"q": "Delegation best practice?", "options": ["Assign all tasks", "Match strengths", "Avoid delegation", "Random assignment"], "a": 1},
        {"q": "Emotional intelligence means?", "options": ["Ignore emotions", "Understand/manage emotions", "Only positives", "Avoid situations"], "a": 1},
        {"q": "Communication skill?", "options": ["One-way", "Active listening", "Avoid feedback", "Minimal interaction"], "a": 1},
        {"q": "Organizational change driver?", "options": ["Avoid change", "Strategic leadership", "Solo decisions", "Only external pressure"], "a": 1},
    ],
}

# Map YouTube IDs (lowercased) to categories
ID_TO_CATEGORY: Dict[str, str] = {
    "kqtd5dpn9c8": "python",
    "w6nzfco5sik": "javascript",
    "8hly31vkya0": "dsa",
    "sqcy0gletpk": "react",
    "7ycw25phnaa": "rest_api",
    "rgoj5yh7evk": "git",
    "hxv3zeqkqgy": "sql",
    "qz0agyrrlhu": "html_css",
    "3hlmds179ye": "cloud",
    "hanw168huqa": "leadership",
}

DEFAULT_TECH = "dsa"


def _choose_category(video_id: str) -> str:
    vid = (video_id or "").strip().lower()
    if vid in ID_TO_CATEGORY:
        return ID_TO_CATEGORY[vid]
    if any(k in vid for k in ["sql", "database", "db"]):
        return "sql"
    if any(k in vid for k in ["html", "css", "web"]):
        return "html_css"
    if any(k in vid for k in ["cloud", "aws"]):
        return "cloud"
    if any(k in vid for k in ["python", "py"]):
        return "python"
    if any(k in vid for k in ["js", "javascript"]):
        return "javascript"
    if any(k in vid for k in ["react"]):
        return "react"
    return DEFAULT_TECH


def generate_quiz_questions(video_id: str, num_questions: int = 20) -> List[Dict[str, Any]]:
    category = _choose_category(video_id)
    bank = QUESTION_BANKS.get(category, QUESTION_BANKS[DEFAULT_TECH])
    questions: List[Dict[str, Any]] = []
    for i in range(num_questions):
        base = bank[i % len(bank)]
        questions.append({
            "q": f"{base['q']} (Question {i+1})",
            "options": base["options"],
            "a": base["a"],
        })
    return questions


if __name__ == "__main__":
    sample_ids = [
        "kqtD5dpn9C8",
        "HXV3zeQKqGY",
        "qz0aGYrrlhU",
        "3hLmDS179YE",
        "W6NZfCO5SIk",
        "HAnw168huqA",
    ]
    for vid in sample_ids:
        qs = generate_quiz_questions(vid, 3)
        print(vid, "->", qs[0]["q"]) 
