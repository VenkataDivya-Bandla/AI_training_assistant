# 🎤 Real Speech-to-Text Quiz Generator

A complete implementation that extracts audio from YouTube videos, converts speech to text using OpenAI Whisper, and generates educational quiz questions from the actual speech content.

## 🚀 Features

### ✅ **Complete Speech-to-Text Pipeline**
- **YouTube Audio Extraction**: Downloads audio from real YouTube videos using `yt-dlp`
- **Speech-to-Text Conversion**: Uses OpenAI Whisper API for accurate transcription
- **Question Generation**: Creates educational questions from real speech content
- **Intelligent Caching**: Caches transcripts and audio files for performance
- **Robust Fallbacks**: Graceful degradation when speech-to-text fails

### ✅ **Advanced Capabilities**
- **Real-time Processing**: Live status updates during audio extraction and transcription
- **Multiple Audio Formats**: Supports MP3, WebM, M4A, and other formats
- **Content-Aware Questions**: Generates relevant questions based on actual video content
- **RESTful API**: Complete API with health checks and testing endpoints
- **Error Handling**: Comprehensive error handling with detailed logging

## 📁 Files Structure

```
├── real_speech_to_text.py      # Core speech-to-text implementation
├── real_speech_api.py          # FastAPI server for speech-to-text
├── complete_demo.py            # Comprehensive demonstration
├── test_real_speech.py         # Testing script
└── SPEECH_TO_TEXT_README.md    # This documentation
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
pip install yt-dlp pydub ffmpeg-python openai fastapi uvicorn
```

### 2. Install FFmpeg (Required for audio processing)
```bash
# Using conda (recommended)
conda install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

### 3. Set OpenAI API Key
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-openai-api-key-here"

# Linux/Mac
export OPENAI_API_KEY="your-openai-api-key-here"
```

## 🎯 Usage

### **Direct Python Usage**
```python
from real_speech_to_text import generate_quiz_from_speech

# Generate quiz from real YouTube video
result = generate_quiz_from_speech("kqtD5dpn9C8", 20)

print(f"Transcript: {result['transcript_length']} characters")
print(f"Questions: {result['total_questions']} generated")
```

### **API Usage**
```bash
# Start the API server
python real_speech_api.py

# Generate quiz via API
curl -X POST "http://localhost:8000/api/generate-quiz" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "kqtD5dpn9C8", "num_questions": 20}'
```

### **API Endpoints**
- `POST /api/generate-quiz` - Generate quiz from video
- `GET /api/generate-quiz/{video_id}` - Quick quiz generation
- `GET /api/health` - System health check
- `GET /api/test/{video_id}` - Test video processing

## 🔄 Complete Pipeline

### **Step 1: YouTube Audio Extraction**
```python
# Downloads audio from YouTube video
audio_file = extract_youtube_audio("video_id")
# Returns: "/path/to/cached/audio.mp3"
```

### **Step 2: Speech-to-Text Conversion**
```python
# Converts audio to text using OpenAI Whisper
transcript = speech_to_text(audio_file)
# Returns: "Full transcript of the video..."
```

### **Step 3: Question Generation**
```python
# Generates questions from real transcript
questions = generate_questions_from_transcript(transcript, 20)
# Returns: [{"q": "question", "options": [...], "a": 1}, ...]
```

### **Step 4: Caching & Optimization**
- Transcripts cached in `transcripts_cache/`
- Audio files cached in `audio_cache/`
- Automatic cleanup of temporary files

## 🎬 Real Video Testing

### **Test with Real Educational Videos**
```python
# Python Programming Tutorial
result = generate_quiz_from_speech("kqtD5dpn9C8", 10)

# JavaScript Course
result = generate_quiz_from_speech("W6NZfCO5SIk", 10)

# Data Structures & Algorithms
result = generate_quiz_from_speech("8jLOx1hD3_o", 10)
```

### **Expected Results**
- ✅ **Audio Extraction**: Downloads real audio from YouTube
- ✅ **Speech-to-Text**: Converts to accurate transcript
- ✅ **Question Generation**: Creates relevant questions from actual content
- ✅ **Caching**: Stores results for future use

## 🔧 Configuration

### **Environment Variables**
```bash
OPENAI_API_KEY=your-openai-api-key    # Required for Whisper API
```

### **Cache Directories**
```
transcripts_cache/    # Cached transcripts
audio_cache/         # Cached audio files
```

### **API Configuration**
```python
# Default settings
HOST = "0.0.0.0"
PORT = 8000
CORS_ORIGINS = ["http://localhost:4028", "http://localhost:3000"]
```

## 🚨 Error Handling

### **Common Issues & Solutions**

1. **FFmpeg Not Found**
   ```
   Solution: Install FFmpeg
   conda install ffmpeg
   ```

2. **OpenAI API Key Missing**
   ```
   Solution: Set environment variable
   $env:OPENAI_API_KEY="your-key"
   ```

3. **YouTube Video Unavailable**
   ```
   Solution: Use different video ID or check video availability
   ```

4. **Audio Extraction Failed**
   ```
   Solution: System falls back to intelligent content-aware questions
   ```

## 📊 Performance Features

### **Caching System**
- **Transcript Caching**: Avoids re-processing same videos
- **Audio Caching**: Reuses downloaded audio files
- **Smart Cleanup**: Removes temporary files automatically

### **Fallback Mechanisms**
- **Content-Aware Fallbacks**: Generates relevant questions when speech-to-text fails
- **Intelligent Pattern Matching**: Detects video content type for appropriate fallbacks
- **Graceful Degradation**: System continues working even with missing dependencies

## 🎯 Success Metrics

### **What Works**
- ✅ **Real YouTube Audio Extraction**: Successfully downloads audio from videos
- ✅ **Speech-to-Text Pipeline**: Complete implementation ready for OpenAI Whisper
- ✅ **Question Generation**: Creates educational questions from content
- ✅ **Caching System**: Optimizes performance with intelligent caching
- ✅ **API Server**: Full RESTful API with comprehensive endpoints
- ✅ **Error Handling**: Robust fallback mechanisms

### **Setup Requirements for Full Functionality**
1. **OpenAI API Key**: For Whisper speech-to-text conversion
2. **FFmpeg**: For audio processing and format conversion
3. **Internet Connection**: For YouTube video access
4. **Real Video IDs**: Use actual YouTube video identifiers

## 🚀 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set OpenAI API key
$env:OPENAI_API_KEY="your-key"

# 3. Run demonstration
python complete_demo.py

# 4. Start API server
python real_speech_api.py

# 5. Test with real video
python test_real_speech.py
```

## 📈 Future Enhancements

- **Batch Processing**: Process multiple videos simultaneously
- **Language Detection**: Automatic language detection for multi-language videos
- **Advanced Caching**: Redis-based distributed caching
- **Web Interface**: Browser-based interface for video processing
- **Analytics**: Processing metrics and performance monitoring

---

**🎉 The complete speech-to-text quiz generator is now fully implemented and ready for production use!**
