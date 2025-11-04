const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://127.0.0.1:8001/api';

// Fallback responses for when API is unavailable
const FALLBACK_RESPONSES = {
  training_assistant: {
    general: "I'm currently experiencing connectivity issues, but I'm here to help! Here are some resources you can check:\n\n• Employee Handbook: Contains company policies and procedures\n• IT Helpdesk: Contact for technical setup assistance\n• HR Portal: Access training materials and schedules\n• Your Manager: Available for any immediate questions\n\nPlease try asking me again in a few minutes, or contact HR directly for urgent matters.",
    
    greeting: "Welcome! I'm temporarily experiencing some technical difficulties, but don't worry - I'll be back online soon. In the meantime:\n\n• Check the Employee Handbook for policies\n• Contact IT for technical setup\n• Reach out to HR for immediate questions\n• Your manager is also available to help\n\nI'll try to assist you again shortly!",
    
    error_429: "I'm experiencing high demand right now due to many new employees onboarding! 🚀\n\nWhile I get back online, here's what you can do:\n• Check the Employee Handbook in your welcome email\n• Visit the HR Portal for immediate resources\n• Contact your manager or HR directly\n• I'll be available again in a few minutes\n\nThanks for your patience!"
  },
  
  quick_actions: {
    policies: "📋 Company Policies (Offline Mode)\n\nKey policies to review:\n• Code of Conduct: Professional behavior standards\n• Attendance Policy: Work hours and time-off procedures\n• IT Security: Password requirements and data protection\n• Communication Guidelines: Email and messaging etiquette\n\nFind detailed information in your Employee Handbook or contact HR for specific questions.",
    
    it: "💻 IT Setup Guide (Offline Mode)\n\nEssential development tools:\n• Git: Version control system\n• Node.js: JavaScript runtime\n• VS Code: Code editor with extensions\n• Docker: Containerization platform\n• Slack: Team communication\n• Jira: Project management\n\nContact IT Helpdesk for installation assistance and credentials.",
    
    meeting: "📅 Meeting Scheduling (Offline Mode)\n\nHow to schedule meetings:\n• Use company calendar system (Outlook/Google)\n• Book meeting rooms through facilities portal\n• Your manager will schedule initial check-ins\n• HR available for onboarding meetings\n\nCheck your welcome email for calendar access instructions.",
    
    training: "📚 Training Resources (Offline Mode)\n\nAvailable learning paths:\n• Technical Skills: Programming and tools training\n• Soft Skills: Communication and leadership\n• Company Culture: Values and best practices\n• Role-Specific: Department training materials\n\nAccess the Learning Management System through HR portal.",
    
    team: "👥 Team Directory (Offline Mode)\n\nKey contacts:\n• Your Direct Manager: Primary point of contact\n• HR Representative: Onboarding and policies\n• IT Support: Technical assistance\n• Buddy/Mentor: Peer support during onboarding\n\nCheck the employee directory in your welcome packet.",
    
    faq: "❓ FAQ (Offline Mode)\n\nCommon questions:\n• When do I get access to systems? Usually within 24-48 hours\n• How do I request time off? Through HR portal\n• Who do I contact for IT issues? IT Helpdesk\n• When is my first team meeting? Your manager will schedule\n\nRefer to Employee Handbook for comprehensive answers."
  }
};

const SYSTEM_PROMPTS = {
  training_assistant: `You are an AI Training Assistant for new employees. Provide helpful, accurate, and concise answers grounded in the provided context.`,
};

function handleApiError(error, context = 'general') {
  console.error('RAG API Error:', error);
  if (context === 'greeting') {
    return FALLBACK_RESPONSES?.training_assistant?.greeting;
  }
  return FALLBACK_RESPONSES?.training_assistant?.general;
}

// Call the local RAG backend /ask
async function askRag(question) {
  const resp = await fetch(`${BACKEND_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!resp.ok) throw new Error(`RAG error ${resp.status}`);
  const data = await resp.json();
  return data?.answer || '';
}

export async function getTrainingAssistantResponse(userMessage, conversationHistory = []) {
  try {
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i?.test(userMessage?.toLowerCase()?.trim());
    const answer = await askRag(userMessage);
    return answer || (isGreeting ? FALLBACK_RESPONSES?.training_assistant?.greeting : FALLBACK_RESPONSES?.training_assistant?.general);
  } catch (error) {
    const context = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i?.test(userMessage?.toLowerCase()?.trim()) ? 'greeting' : 'general';
    return handleApiError(error, context);
  }
}

export async function getContextualResponse(userMessage, context = {}, conversationHistory = []) {
  try {
    // Use the same /ask for now; UI provides context text via the question
    const question = context?.title ? `${userMessage}\n\nContext: ${context?.title}` : userMessage;
    return await askRag(question);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getStreamingResponse(userMessage, conversationHistory = [], onChunk) {
  try {
    const answer = await askRag(userMessage);
    onChunk(answer, answer);
  } catch (error) {
    const fallbackResponse = handleApiError(error);
    onChunk('', fallbackResponse);
  }
}

export async function getQuickActionResponse(category) {
  const prompts = {
    policies: 'Tell me about company policies from the handbook',
    it: 'Give the IT setup guidance from the handbook',
    meeting: 'Explain meeting scheduling guidelines from the handbook',
    training: 'List training resources from the handbook',
    team: 'Describe team directory and contacts from the handbook',
    faq: 'Answer frequently asked onboarding questions from the handbook',
  };
  try {
    return await askRag(prompts?.[category] || prompts?.faq);
  } catch (error) {
    return FALLBACK_RESPONSES?.quick_actions?.[category] || FALLBACK_RESPONSES?.quick_actions?.faq;
  }
}

export async function checkApiStatus() {
  try {
    const resp = await fetch(`${BACKEND_URL}/health`);
    if (!resp.ok) throw new Error('health not ok');
    return { status: 'online', message: 'RAG backend reachable' };
  } catch (error) {
    return { status: 'offline', message: 'RAG backend unreachable', error: String(error) };
  }
}

export default {
  getTrainingAssistantResponse,
  getContextualResponse,
  getStreamingResponse,
  getQuickActionResponse,
  checkApiStatus
};