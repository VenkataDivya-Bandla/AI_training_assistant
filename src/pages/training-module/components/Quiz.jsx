import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

// RAG API endpoint
// RAG API endpoint
const RAG_API_URL = 'http://localhost:8000/api/generate_quiz';

// --- HELPER FUNCTION: PARSE RAG TEXT INTO JS ARRAY ---
// 🚨 REMOVED: The backend now returns structured JSON, making this function obsolete.
// const parseQuizText = (rawText) => { ... }
// --- END HELPER FUNCTION ---


// Fallback questions in case RAG API is not available
const FALLBACK_QUESTIONS = {
  '1': [
    { q: 'What command initializes a new Git repository?', options: ['git init', 'git start', 'git new', 'git create'], a: 0 },
    { q: 'Which command stages changes for commit?', options: ['git push', 'git add', 'git stage', 'git include'], a: 1 },
    { q: 'What file lists patterns to ignore in Git?', options: ['.gitignore', 'git.ignore', 'ignore.txt', '.git'], a: 0 },
    { q: 'Command to view commit history?', options: ['git history', 'git commits', 'git log', 'git show'], a: 2 },
    { q: 'Create a new branch?', options: ['git new branch', 'git branch', 'git create', 'git checkout -b'], a: 1 },
    { q: 'Switch to another branch?', options: ['git move', 'git checkout', 'git switchto', 'git change'], a: 1 },
    { q: 'Upload local commits to remote?', options: ['git send', 'git upload', 'git push', 'git publish'], a: 2 },
    { q: 'Download latest changes from remote?', options: ['git pull', 'git fetch', 'git get', 'git update'], a: 0 },
    { q: 'Combine changes from another branch?', options: ['git join', 'git merge', 'git connect', 'git union'], a: 1 },
    { q: 'File that stores project history?', options: ['.git', '.history', '.repo', 'history.git'], a: 0 }
  ],
  '2': [
    { q: 'Strong password should include?', options: ['Only letters', 'Mixed characters and length', 'Only numbers', 'Your name'], a: 1 },
    { q: 'Phishing is?', options: ['Secure login', 'Malicious attempt to get info', 'Encryption method', 'Firewall'], a: 1 },
    { q: 'Two-factor authentication adds?', options: ['Less security', 'Extra verification step', 'Faster login', 'None'], a: 1 },
    { q: 'Public Wi-Fi risk?', options: ['Always safe', 'Potential data interception', 'Encrypts traffic', 'Blocks hackers'], a: 1 },
    { q: 'Report suspicious email to?', options: ['Friends', 'IT/Security team', 'Social media', 'Ignore'], a: 1 },
    { q: 'Device updates are for?', options: ['New wallpapers', 'Security patches and features', 'Battery drain', 'Nothing'], a: 1 },
    { q: 'Use this to store passwords:', options: ['Browser notes', 'Plain text files', 'Password manager', 'Sticky notes'], a: 2 },
    { q: 'VPN usage helps to:', options: ['Speed internet', 'Secure network traffic', 'Break laws', 'Block ads'], a: 1 },
    { q: 'Sharing credentials is:', options: ['Recommended', 'Acceptable', 'Prohibited', 'Optional'], a: 2 },
    { q: 'Social engineering targets:', options: ['Technology only', 'People and trust', 'Servers only', 'Encryption'], a: 1 }
  ],
  '3': [
    { q: 'Active listening involves:', options: ['Interrupting often', 'Waiting to speak', 'Focused attention and feedback', 'Avoiding questions'], a: 2 },
    { q: 'Clear communication should be:', options: ['Ambiguous', 'Concise and structured', 'Lengthy', 'Jargon-heavy'], a: 1 },
    { q: 'Non-verbal cues include:', options: ['Emails', 'Body language', 'Text only', 'Code'], a: 1 },
    { q: 'Good presentations use:', options: ['Overloaded slides', 'Readable visuals', 'Tiny fonts', 'No practice'], a: 1 },
    { q: 'Conflict is best handled by:', options: ['Avoidance', 'Aggression', 'Constructive dialogue', 'Ignoring'], a: 2 },
    { q: 'Feedback should be:', options: ['Personal attacks', 'Specific and actionable', 'Vague', 'Public shaming'], a: 1 },
    { q: 'Empathy helps by:', options: ['Escalating issues', 'Understanding others', 'Ending conversations', 'Avoiding clarity'], a: 1 },
    { q: 'Storytelling improves:', options: ['Engagement', 'Confusion', 'Time waste', 'None'], a: 0 },
    { q: 'Eye contact should be:', options: ['Avoided', 'Brief and appropriate', 'Continuous stare', 'Irrelevant'], a: 1 },
    { q: 'Q&A best practice:', options: ['Ignore questions', 'Invite and manage time', 'Argue with audience', 'End early'], a: 1 }
  ]
};

const PASS_PERCENTAGE = 80;
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 24 * 60 * 60 * 1000; // 24 hours

const getStorageKey = (courseId) => `quiz_${courseId}`;
const getCompletionKey = (courseId) => `course_completed_${courseId}`;

const readPersisted = (courseId) => {
  try {
    const raw = localStorage.getItem(getStorageKey(courseId));
    if (!raw) return { attempts: 0, lockedUntil: 0, passed: false };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number(parsed?.attempts) || 0,
      lockedUntil: Number(parsed?.lockedUntil) || 0,
      passed: Boolean(parsed?.passed) || false,
      lastPercentage: Number(parsed?.lastPercentage) || 0,
    };
  } catch {
    return { attempts: 0, lockedUntil: 0, passed: false };
  }
};

const writePersisted = (courseId, data) => {
  try {
    localStorage.setItem(getStorageKey(courseId), JSON.stringify(data));
  } catch {}
};

const markCourseCompleted = (courseId) => {
  try {
    localStorage.setItem(getCompletionKey(courseId), 'true');
  } catch {}
};

const Quiz = ({ courseId, currentItem, onPass }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [persist, setPersist] = useState(() => readPersisted(courseId));
  const [now, setNow] = useState(Date.now());

  // Use the specific module's YouTube video ID
  const generateVideoId = (courseId, currentItem) => {
    // If currentItem has a youtubeId, use it
    if (currentItem && currentItem.youtubeId) {
      return currentItem.youtubeId;
    }
    
    // Fallback to course-level video IDs
    const courseVideoIds = {
      '1': 'kqtD5dpn9C8', // Python Programming Tutorial
      '2': 'W6NZfCO5SIk', // JavaScript Programming Tutorial  
      '3': '8jLOx1hD3_o', // C++ DSA Tutorial
      '4': 'dQw4w9WgXcQ', // Team Lead (placeholder)
      '5': 'dQw4w9WgXcQ', // Product Manager (placeholder)
      '6': 'dQw4w9WgXcQ', // Assistant Manager (placeholder)
      '7': 'dQw4w9WgXcQ', // Deputy Manager (placeholder)
      '8': 'dQw4w9WgXcQ', // Manager (placeholder)
      '9': 'dQw4w9WgXcQ', // Senior Manager (placeholder)
      '10': 'dQw4w9WgXcQ' // Executive Manager (placeholder)
    };
    
    return courseVideoIds[courseId] || 'kqtD5dpn9C8'; // Default to Python tutorial
  };

  // Keep a ticking clock to update lockout countdown once per minute
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch questions from RAG API when course changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Generate video ID for this specific module
        const videoId = generateVideoId(courseId, currentItem);
        console.log(`Fetching questions for module: ${currentItem?.title || 'Unknown'}, video ID: ${videoId}`);
        
        // Try to fetch from RAG API first
        const response = await fetch(`${RAG_API_URL}/${videoId}?num_questions=20`);
        
        if (response.ok) {
          const data = await response.json();
          
          // 🚨 FIX APPLIED HERE 🚨
          // The API now returns a JSON object where data.questions is already an ARRAY of structured objects.
          // NO parsing is needed. We use data.questions directly.
          const structuredQuestions = data.questions || [];
          
          // Check if the LLM successfully returned any questions
          if (structuredQuestions.length === 0) {
            // If the array is empty, it means the RAG API failed to generate the quiz.
            throw new Error('AI returned an empty or invalid question array.');
          }
          
          setQuestions(structuredQuestions);
        } else {
          // Handle non-200 responses (e.g., 500 error from parsing failure in FastAPI)
          const errorDetail = (await response.json()).detail || response.statusText;
          throw new Error(`RAG API returned error: ${errorDetail}`);
        }
      } catch (err) {
        console.warn('RAG API unavailable or failed to process structured request, using fallback questions:', err);
        // Fallback to static questions
        const fallbackQuestions = FALLBACK_QUESTIONS[courseId] || FALLBACK_QUESTIONS['1'];
        setQuestions(fallbackQuestions);
        setError(`Using offline questions - RAG API unavailable (${err.message})`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, currentItem]);

  // Refresh persisted state when course changes
  useEffect(() => {
    setPersist(readPersisted(courseId));
    setSubmitted(false);
    // This now correctly initializes answers based on the *structured* questions length
    setAnswers(Array(questions.length).fill(null)); 
  }, [courseId, questions.length]);

  const isLocked = persist.lockedUntil && now < persist.lockedUntil;
  const hasPassed = Boolean(persist.passed);
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (persist.attempts || 0));

  const selectAnswer = (qi, oi) => {
    if (submitted || isLocked || hasPassed) return;
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
  };

  const submitQuiz = () => {
    if (isLocked || hasPassed) return;
    setSubmitted(true);
    // scoring computed below, then update attempts/lockout
  };

  const score = submitted ? answers.reduce((acc, a, i) => acc + (a === questions[i].a ? 1 : 0), 0) : 0;
  const percentage = submitted ? Math.round((score / questions.length) * 100) : 0;

  // When a submission has occurred, update persistence with pass/attempts/lockout
  useEffect(() => {
    if (!submitted) return;
    // Calculate new state
    const passedNow = percentage >= PASS_PERCENTAGE;
    const nextAttempts = (persist.attempts || 0) + 1;
    let lockedUntil = persist.lockedUntil || 0;
    let passed = persist.passed || false;

    if (passedNow) {
      passed = true;
      lockedUntil = 0;
      markCourseCompleted(courseId);
      try { onPass && onPass(); } catch {}
    } else if (nextAttempts >= MAX_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_MS;
    }

    const nextPersist = { attempts: nextAttempts, lockedUntil, passed, lastPercentage: percentage };
    setPersist(nextPersist);
    writePersisted(courseId, nextPersist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const resetForRetry = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const lockedRemainingMs = Math.max(0, (persist.lockedUntil || 0) - now);
  const lockedHours = Math.ceil(lockedRemainingMs / (60 * 60 * 1000));

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Generating questions using AI...</p>
        </div>
        {error && <p className="mt-4 text-xs text-red-500">Warning: {error}</p>}
      </div>
    );
  }

  // Show error state (Offline Mode)
  if (error) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center mb-2">
          <Icon name="AlertTriangle" size={16} className="text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-800">Offline Mode</span>
          </div>
        <p className="text-xs text-yellow-700 mb-4">{error}</p>
        <div className="space-y-4">
          {questions.map((item, qi) => (
            <div key={qi} className="border border-border rounded p-3">
              <div className="text-sm font-medium text-foreground mb-2">Q{qi + 1}. {item.q}</div>
              <div className="grid grid-cols-1 gap-2">
                {item.options.map((opt, oi) => {
                  const isCorrect = submitted && oi === item.a;
                  const isWrong = submitted && answers[qi] === oi && oi !== item.a;
                  return (
                    <label key={oi} className={`flex items-center space-x-2 rounded border px-3 py-2 cursor-pointer transition-colors ${
                      isCorrect ? 'bg-green-100 border-green-300 text-green-800' :
                      isWrong ? 'bg-red-100 border-red-300 text-red-800' :
                      answers[qi] === oi ? 'bg-primary/10 border-primary/30 text-foreground' : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                    }`}>
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => selectAnswer(qi, oi)}
                        className="accent-primary"
                        disabled={submitted || isLocked || hasPassed}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          {!submitted ? (
            <Button onClick={submitQuiz} iconName="CheckCircle" iconPosition="left" disabled={isLocked || hasPassed}>Submit Quiz</Button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-foreground">Score: <strong>{score}</strong> / {questions.length}</span>
              <span className="text-sm text-muted-foreground">({percentage}%)</span>
              {!hasPassed && !isLocked && persist.attempts < MAX_ATTEMPTS && (
                <Button variant="outline" onClick={resetForRetry} iconName="RotateCcw" iconPosition="left">Retry</Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Success message for RAG questions */}
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
        <div className="flex items-center">
          <Icon name="CheckCircle" size={16} className="text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">AI-Generated Questions</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          {questions.length} questions generated from video content using RAG technology
        </p>
      </div>
      
      <div className="space-y-4">
        {/* This is the line that caused the error, but it is now safe 
             because 'questions' is guaranteed to be an array by the parsing logic */}
        {questions.map((item, qi) => (
          <div key={qi} className="border border-border rounded p-3">
            <div className="text-sm font-medium text-foreground mb-2">Q{qi + 1}. {item.q}</div>
            <div className="grid grid-cols-1 gap-2">
              {item.options.map((opt, oi) => {
                const isCorrect = submitted && oi === item.a;
                const isWrong = submitted && answers[qi] === oi && oi !== item.a;
                return (
                  <label key={oi} className={`flex items-center space-x-2 rounded border px-3 py-2 cursor-pointer transition-colors ${
                    isCorrect ? 'bg-green-100 border-green-300 text-green-800' :
                    isWrong ? 'bg-red-100 border-red-300 text-red-800' :
                    answers[qi] === oi ? 'bg-primary/10 border-primary/30 text-foreground' : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                  }`}>
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => selectAnswer(qi, oi)}
                      className="accent-primary"
                      disabled={submitted || isLocked || hasPassed}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {!submitted ? (
          <Button onClick={submitQuiz} iconName="CheckCircle" iconPosition="left" disabled={isLocked || hasPassed}>Submit Quiz</Button>
        ) : (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-foreground">Score: <strong>{score}</strong> / {questions.length}</span>
            <span className="text-sm text-muted-foreground">({percentage}%)</span>
            {!hasPassed && !isLocked && persist.attempts < MAX_ATTEMPTS && (
              <Button variant="outline" onClick={resetForRetry} iconName="RotateCcw" iconPosition="left">Retry</Button>
            )}
          </div>
        )}
      </div>

      {/* Status and guidance */}
      <div className="mt-3 space-y-2">
        {hasPassed && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
            Passed! You achieved at least {PASS_PERCENTAGE}% and this course is marked as completed.
          </div>
        )}
        {!hasPassed && submitted && (
          <div className={`text-sm ${percentage >= PASS_PERCENTAGE ? 'text-green-700' : 'text-red-700'}`}>
            {percentage >= PASS_PERCENTAGE ? 'You passed.' : `You did not reach ${PASS_PERCENTAGE}%.`}
          </div>
        )}
        {!hasPassed && !isLocked && (
          <div className="text-xs text-muted-foreground">Attempts: {persist.attempts || 0} / {MAX_ATTEMPTS}. Attempts left: {attemptsLeft}.</div>
        )}
        {isLocked && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            You have reached the maximum of {MAX_ATTEMPTS} attempts. Please wait up to {lockedHours} hour(s) before retaking the quiz.
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;