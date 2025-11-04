# 🚀 Quick Setup Guide for Speech-to-Text Quiz Generator

## ✅ Current Status
- **Backend API**: ✅ Running on http://localhost:8000
- **Frontend**: ✅ Should be running on http://localhost:4028
- **Quiz Generation**: ✅ Working with programming-related questions
- **Speech-to-Text**: ⚠️ Needs OpenAI API key and FFmpeg for full functionality

## 🔧 To Get Full Speech-to-Text Functionality:

### 1. Set OpenAI API Key
```bash
# In PowerShell
$env:OPENAI_API_KEY="your-openai-api-key-here"

# Get your key from: https://platform.openai.com/api-keys
```

### 2. Install FFmpeg (for audio processing)
```bash
# Using conda (recommended)
conda install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

## 🎯 What's Working Now

### ✅ **Programming-Related Questions**
The system now generates relevant questions like:
- "Which is a characteristic of a binary tree?"
- "What is the time complexity of binary search?"
- "What are common data structures?"

### ✅ **Real YouTube Video Integration**
- Course 1 (Intern): Uses Python Programming Tutorial (kqtD5dpn9C8)
- Course 2 (Software Engineer): Uses JavaScript Tutorial (W6NZfCO5SIk)
- Course 3 (Senior Engineer): Uses C++ DSA Tutorial (8jLOx1hD3_o)

### ✅ **API Endpoints**
- `GET /api/generate-quiz/{video_id}` - Generate quiz for specific video
- `POST /api/generate-quiz` - Generate quiz with custom parameters
- `GET /api/health` - Health check

## 🧪 Test the System

### Test API Directly:
```bash
curl "http://localhost:8000/api/generate-quiz/kqtD5dpn9C8?num_questions=5"
```

### Test in Frontend:
1. Go to http://localhost:4028
2. Navigate to "Intern: Programming & Cloud Fundamentals"
3. Click on "Module Quiz"
4. You should see programming-related questions instead of generic ones

## 🔄 How It Works

1. **Frontend** sends real YouTube video ID (e.g., "kqtD5dpn9C8")
2. **Backend** attempts to extract audio from YouTube video
3. **Speech-to-Text** converts audio to transcript (if OpenAI key is set)
4. **Question Generation** creates questions from transcript or fallback content
5. **Frontend** displays programming-related questions

## 🎉 Success!

Your quiz generator is now working with **programming-related questions** instead of generic project management questions!

The system will:
- ✅ Generate relevant programming questions
- ✅ Use real YouTube video content (when API key is set)
- ✅ Fall back to intelligent content-aware questions
- ✅ Cache results for better performance

## 🚨 Troubleshooting

If you still see generic questions:
1. Check that the backend is running: `curl http://localhost:8000/api/health`
2. Refresh the frontend page
3. Check browser console for any errors
4. Verify the video ID is being sent correctly

---

**🎯 The system is now generating programming-related questions as requested!**
