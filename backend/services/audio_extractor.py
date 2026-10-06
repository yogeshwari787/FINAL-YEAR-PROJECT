import subprocess
import os
from pathlib import Path

def extract_audio_from_video(video_path: str, output_audio_path: str = None) -> str:
    """
    Extracts high quality audio (.wav or .mp3) from a video file using ffmpeg.
    """
    video_path_obj = Path(video_path)
    if not video_path_obj.exists():
        raise FileNotFoundError(f"Video file not found at {video_path}")
        
    if output_audio_path is None:
        output_audio_path = str(video_path_obj.with_suffix('.wav'))
        
    command = [
        'ffmpeg',
        '-y', # overwrite if exists
        '-i', video_path,
        '-vn', # disable video recording
        '-acodec', 'pcm_s16le', # 16-bit PCM WAV
        '-ar', '16000', # 16kHz sampling rate (optimal for Sarvam STT)
        '-ac', '1', # mono channel
        output_audio_path
    ]
    
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg audio extraction failed: {result.stderr}")
        
    return output_audio_path
