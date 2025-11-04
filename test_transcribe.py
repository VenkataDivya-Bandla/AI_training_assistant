import requests

audio_file = "dQw4w9WgXcQ.mp3"
url = "http://127.0.0.1:8001/transcribe"

with open(audio_file, "rb") as f:
    response = requests.post(url, files={"file": f})

print(response.status_code)
print(response.json())
