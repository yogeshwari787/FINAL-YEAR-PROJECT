import os
import time
import json
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sarvam_service")

class SarvamService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY", "")

    def transcribe_audio(self, audio_file_path: str, with_diarization: bool = True) -> Dict[str, Any]:
        """
        Transcribes audio using Sarvam AI Saaras v3 API.
        If no API key is set, returns simulated structured transcript for local demo/testing.
        """
        if not self.api_key or self.api_key == "YOUR_SARVAM_API_KEY_HERE":
            logger.warning("No valid SARVAM_API_KEY found. Returning demo transcript mode.")
            return self._generate_mock_transcript(audio_file_path)

        try:
            from sarvamai import SarvamAI
            client = SarvamAI(api_key=self.api_key)
            
            # Step 1: Create batch transcript job or direct transcribe
            # Using direct speech-to-text REST API endpoint for real-time / standard files
            import requests
            url = "https://api.sarvam.ai/speech-to-text"
            
            payload = {
                'model': 'saaras:v3',
                'language_code': 'unknown',
                'with_diarization': str(with_diarization).lower()
            }
            
            with open(audio_file_path, 'rb') as f:
                files = [('file', (os.path.basename(audio_file_path), f, 'audio/wav'))]
                headers = {'api-subscription-key': self.api_key}
                response = requests.post(url, headers=headers, data=payload, files=files)
                
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Sarvam API error ({response.status_code}): {response.text}")
                # Fallback to job method or mock
                return {
                    "error": response.text,
                    "status_code": response.status_code,
                    "transcript": f"Error calling Sarvam API: {response.text}"
                }

        except Exception as e:
            logger.error(f"Exception during Sarvam transcription: {str(e)}")
            raise e

    def _generate_mock_transcript(self, audio_file_path: str) -> Dict[str, Any]:
        """Generates mock diarized transcript for testing without API key."""
        return {
            "transcript": "Welcome everyone to our project meeting. Today we are presenting the video meeting assistant system with automated transcript synchronization. The system extracts audio from meeting recordings and processes it using Sarvam AI for accurate speech recognition and speaker diarization. Let's demonstrate how clicking any transcript line jumps the video directly to that key moment.",
            "language_code": "en-IN",
            "diarized_transcript": {
                "entries": [
                    {
                        "start_time_seconds": 0.0,
                        "end_time_seconds": 4.5,
                        "speaker_id": "Speaker 1",
                        "transcript": "Welcome everyone to our project meeting."
                    },
                    {
                        "start_time_seconds": 4.6,
                        "end_time_seconds": 11.2,
                        "speaker_id": "Speaker 1",
                        "transcript": "Today we are presenting the video meeting assistant system with automated transcript synchronization."
                    },
                    {
                        "start_time_seconds": 11.5,
                        "end_time_seconds": 18.0,
                        "speaker_id": "Speaker 2",
                        "transcript": "The system extracts audio from meeting recordings and processes it using Sarvam AI for accurate speech recognition and speaker diarization."
                    },
                    {
                        "start_time_seconds": 18.2,
                        "end_time_seconds": 24.5,
                        "speaker_id": "Speaker 2",
                        "transcript": "Let's demonstrate how clicking any transcript line jumps the video directly to that key moment."
                    }
                ]
            }
        }
