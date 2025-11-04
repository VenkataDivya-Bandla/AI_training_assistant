import os
import yt_dlp
import requests
import numpy as np
import whisper
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class RAGQuizGenerator:
    def __init__(self, rag_api_url="http://127.0.0.1:8001/api/generate_quiz"):
        self.rag_api_url = rag_api_url
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embeddings_cache = {}
        self.whisper_model = whisper.load_model("base")

    def download_youtube_audio(self, video_id):
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        audio_path = f"{video_id}.mp3"

        ydl_opts_audio = {
            'format': 'bestaudio/best',
            'outtmpl': audio_path,
            'quiet': False,
            'noplaylist': True,
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                              '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            'extractor_args': {'youtube': {'player_client': ['android']}},
        }

        ydl_opts_subs = {
            'writesubtitles': True,
            'subtitleslangs': ['en'],
            'skip_download': True,
            'outtmpl': f"{video_id}.vtt",
            'quiet': False
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts_audio) as ydl:
                ydl.download([video_url])
            return audio_path
        except yt_dlp.utils.DownloadError as e:
            print(f"⚠ Audio download failed: {e}")
            print("ℹ Falling back to subtitles if available...")
            try:
                with yt_dlp.YoutubeDL(ydl_opts_subs) as ydl:
                    ydl.extract_info(video_url, download=True)
                    vtt_files = [f for f in os.listdir('.') if f.startswith(video_id) and f.endswith('.vtt')]
                    return vtt_files[0] if vtt_files else None
            except Exception as sub_e:
                print(f"⚠ Failed to get subtitles: {sub_e}")
                return None

    def transcribe_audio(self, audio_path):
        if audio_path is None or not os.path.exists(audio_path):
            print("⚠ No audio or subtitle file found.")
            return "No transcript available."

        if audio_path.endswith(".mp3"):
            print("🎧 Transcribing audio locally using Whisper...")
            result = self.whisper_model.transcribe(audio_path)
            return result["text"]
        elif audio_path.endswith(".vtt"):
            return self.parse_vtt_to_text(audio_path)
        else:
            return "No transcript available."

    def parse_vtt_to_text(self, vtt_path):
        if not os.path.exists(vtt_path):
            return ""
        with open(vtt_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if "-->" not in line and line.strip() and not line.startswith("WEBVTT")]
        return " ".join(lines)

    def split_text(self, text, max_length=500):
        words = text.split()
        return [' '.join(words[i:i + max_length]) for i in range(0, len(words), max_length)]

    def create_embeddings(self, text_chunks):
        return self.model.encode(text_chunks)

    def retrieve_relevant_chunks(self, query, text_chunks, embeddings, top_k=3):
        query_embedding = self.model.encode([query])
        similarities = cosine_similarity(query_embedding, embeddings)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [text_chunks[i] for i in top_indices]

    def generate_quiz_from_context(self, context, video_id, num_questions=5):
        print("🧩 Sending context to RAG API for quiz generation...")
        payload = {
            "context": context,
            "num_questions": num_questions,
            "video_id": video_id  # ✅ Added this to fix the 422 error
        }
        try:
            response = requests.post(self.rag_api_url, json=payload)
            if response.status_code == 200:
                return response.json().get("questions", "No quiz generated.")
            else:
                return f"Error: {response.status_code}, {response.text}"
        except Exception as e:
            return f"⚠ Could not reach RAG API: {e}"

    def generate_questions_with_rag(self, video_id, num_questions=5):
        print(f"🚀 Starting quiz generation for YouTube video: {video_id}")
        audio_path = self.download_youtube_audio(video_id)
        transcript = self.transcribe_audio(audio_path)
        chunks = self.split_text(transcript)
        embeddings = self.create_embeddings(chunks)
        context = " ".join(chunks)  # ✅ use full transcript
        quiz = self.generate_quiz_from_context(context, video_id, num_questions)
        return quiz


if __name__ == "__main__":
    generator = RAGQuizGenerator(rag_api_url="http://127.0.0.1:8001/api/generate_quiz")
    video_id = "dQw4w9WgXcQ"
    quiz = generator.generate_questions_with_rag(video_id)
    print("\n📝 Generated Quiz:\n")
    print(quiz)
