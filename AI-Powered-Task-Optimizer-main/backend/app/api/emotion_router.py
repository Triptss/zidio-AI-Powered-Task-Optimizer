from fastapi import APIRouter, File, UploadFile, HTTPException
import shutil
import os
from deepface import DeepFace
import numpy as np
# Corrected import path
from app.models.emotion_models import EmotionResponse

router = APIRouter()

TEMP_UPLOAD_DIR = "temp_uploads" # Should be relative to where main.py is run (backend root)
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)


@router.post("/analyze_face_emotion", response_model=EmotionResponse)
async def analyze_face_emotion_endpoint(image_file: UploadFile = File(...)):
    temp_file_path = None
    try:
        if not image_file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

        # Ensure filename is somewhat safe, or generate a unique one
        filename = image_file.filename if image_file.filename else "temp_image.jpg"
        # Basic sanitization or use a UUID for filename if concerned about path traversal with user-supplied filenames
        safe_filename = os.path.basename(filename) 
        temp_file_path = os.path.join(TEMP_UPLOAD_DIR, safe_filename)
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(image_file.file, buffer)
        
        analysis_result = DeepFace.analyze(
            img_path=temp_file_path,
            actions=['emotion'],
            enforce_detection=True,
            detector_backend='opencv'
        )
        
        if isinstance(analysis_result, list) and len(analysis_result) > 0:
            first_face_analysis = analysis_result[0]
        elif isinstance(analysis_result, dict):
             first_face_analysis = analysis_result
        else:
            raise HTTPException(status_code=400, detail="No face detected or analysis failed.")

        dominant_emotion = first_face_analysis.get("dominant_emotion", "unknown").lower()
        emotions_data = first_face_analysis.get("emotion", {})
        serializable_emotions = {k.lower(): float(v) for k, v in emotions_data.items()}

        return EmotionResponse(
            dominant_emotion=dominant_emotion,
            emotions=serializable_emotions
        )
    except HTTPException as http_exc:
        raise http_exc
    except ValueError as ve: # DeepFace specific error for no face
        print(f"DeepFace analysis error: {ve}")
        raise HTTPException(status_code=400, detail=f"Could not analyze image: {str(ve)}")
    except Exception as e:
        print(f"Error during facial emotion analysis: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if image_file:
            await image_file.close()
