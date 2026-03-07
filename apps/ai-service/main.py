from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
import numpy as np
import cv2
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

app = FastAPI(title="Subhvivah AI Moderation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskScoreResponse(BaseModel):
    score: float
    flags: List[str]
    is_safe: bool

@app.get("/")
async def root():
    return {"message": "Subhvivah AI Moderation Service is running"}

@app.post("/analyze/image", response_model=RiskScoreResponse)
async def analyze_image(file: UploadFile = File(...)):
    # Mock AI analysis for now
    # In production, this would use Google Vision or AWS Textract
    # to detect text, faces, and inappropriate content.
    
    contents = await file.read()
    # Simple mock logic
    score = 0.1 # Low risk by default
    flags = []
    
    # Example: detect if image is too small or weird aspect ratio
    # (Just as a placeholder for real AI logic)
    
    return RiskScoreResponse(
        score=score,
        flags=flags,
        is_safe=score < 0.7
    )

@app.post("/analyze/chat")
async def analyze_chat(text: str):
    # Detect escort keywords, contact sharing, etc.
    escort_keywords = ["escort", "service", "price", "hotel", "meet now"]
    contact_keywords = ["whatsapp", "call me", "+91", "@", ".com"]
    
    flags = []
    for kw in escort_keywords:
        if kw in text.lower():
            flags.append(f"ESCORT_DETECTED: {kw}")
            
    for kw in contact_keywords:
        if kw in text.lower():
            flags.append(f"CONTACT_SHARING_DETECTED: {kw}")
            
    score = 0.0
    if flags:
        score = 0.8 if any("ESCORT" in f for f in flags) else 0.5
        
    return {
        "score": score,
        "flags": flags,
        "is_safe": score < 0.7
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
