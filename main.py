import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Anxiety Level Predictor", version="1.0")

# ✅ CORS — allows React on port 5173 to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    
   allow_origins=[
    "http://localhost:5173",
    "https://student-anxiety-detector.vercel.app",  # your exact vercel URL
]
)

# ✅ Load model once at startup
model = joblib.load("anxiety_model.pkl")

# ✅ Label mapping (match your LabelEncoder order)
LABEL_MAP = {
    0: "High Anxiety",
    1: "Low Anxiety",
    2: "Moderate Anxiety"
}

# ✅ Request body schema
class PredictRequest(BaseModel):
    statement: str

# ✅ Response schema
class PredictResponse(BaseModel):
    statement: str
    anxiety_level: str
    confidence: float

@app.get("/")
def root():
    return {"message": "Anxiety Level Predictor API is running ✅"}

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    statement = request.statement.strip()

    if not statement:
        return {"statement": statement, "anxiety_level": "Unknown", "confidence": 0.0}

    pred = model.predict([statement])[0]
    proba = model.predict_proba([statement])[0]
    confidence = float(np.max(proba))
    anxiety_level = LABEL_MAP.get(pred, str(pred))

    return {
        "statement": statement,
        "anxiety_level": anxiety_level,
        "confidence": round(confidence * 100, 2)
    }

@app.get("/health")
def health():
    return {"status": "ok"}
