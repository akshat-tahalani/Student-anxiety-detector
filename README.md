Made by Akshat tahalani and Harsh saxena ( the other team member had no contributions)

# 🧠 Student Exam Anxiety Detector

A full-stack AI-powered web application that analyzes student statements and classifies their anxiety level as **Low**, **Moderate**, or **High** — with personalized suggestions and interactive calming exercises.

---

## 🌐 Live Demo

- **Frontend:** [student-anxiety-detector.vercel.app](https://student-anxiety-detector.vercel.app)
- **Backend API:** [akshattahalani-anxiety-detector.hf.space/docs](https://akshattahalani-anxiety-detector.hf.space/docs)

---

## 📌 Project Overview

Students often struggle to identify and articulate their anxiety levels before exams. This app provides a simple interface where a student types how they feel — and an AI model instantly classifies their mental state and suggests targeted coping strategies.

---

## 🧪 Model & Training

### Dataset
- **Source:** Kaggle — Student Mental Health Statements Dataset
- **Size:** 50,000+ entries
- **Columns:** `statement` (text), `status` (mental health label)

### Label Remapping
The original labels were remapped into 3 anxiety levels:

| Original Label | Anxiety Level |
|---|---|
| Normal | 🟢 Low Anxiety |
| Anxiety | 🟡 Moderate Anxiety |
| Depression, Bipolar, Suicidal | 🔴 High Anxiety |

### Class Imbalance Problem
The dataset was heavily imbalanced:
- Normal: ~19,000 entries
- Anxiety: ~6,000 entries
- Others: remaining

This caused the model to predict everything as "Normal". Fixed using:
- **Resampling** — all classes oversampled/undersampled to 9,000 entries each
- **Class weights** — `class_weight="balanced"` in the classifier
- **Weighted loss** — `CrossEntropyLoss` with computed class weights

### Model Architecture
Two approaches were explored:

#### Approach 1 — DistilBERT (Transformer-based)
- Model: `distilbert-base-uncased` via HuggingFace Transformers
- Tokenizer: AutoTokenizer with max_length=128
- Fine-tuned for sequence classification (3 labels)
- Trained on Kaggle GPU with 5 epochs
- Higher accuracy (~88-94%) but larger model size

#### Approach 2 — TF-IDF + Random Forest (Classical ML) ✅ Used in Production
- Vectorizer: `TfidfVectorizer(max_features=10000, ngram_range=(1,2))`
- Classifier: `RandomForestClassifier(n_estimators=200, class_weight="balanced")`
- Trained and evaluated on Kaggle
- Serialized using `joblib` with compression level 9
- Lighter and faster for deployment on free-tier infrastructure

### Training Environment
- Platform: **Kaggle Notebooks**
- GPU: Kaggle free-tier GPU (for DistilBERT experiments)
- Final model saved as `anxiety_model.pkl`

---

## 🏗️ Architecture

```
User (React Frontend)
        ↓  POST /predict
FastAPI Backend (Hugging Face Spaces)
        ↓  loads anxiety_model.pkl
        ↓  returns { anxiety_level, confidence }
Back to React → Result Page → Suggestions → Exercises
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| React Router DOM | Multi-page navigation |
| Framer Motion | Page transitions & animations |
| Three.js + React Three Fiber | 3D background animation |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Scikit-learn | ML model (TF-IDF + Random Forest) |
| Joblib | Model serialization |
| Pydantic | Request/response validation |

### Deployment
| Service | What's deployed |
|---|---|
| Vercel | React frontend |
| Hugging Face Spaces (Docker) | FastAPI backend + model |
| Git LFS | Large model file (132MB .pkl) tracking |

---

## 📁 Project Structure

```
Student-anxiety-detector/
├── frontend/                        # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── InputSection.jsx     # Main input + API call
│   │   │   ├── AnalysisResult.jsx   # Result display
│   │   │   ├── Suggestions.jsx      # Personalized tips
│   │   │   ├── ExercisePlayer.jsx   # Interactive exercises
│   │   │   └── Dashboard.jsx        # History
│   │   └── components/
│   │       ├── GlassCard.jsx
│   │       ├── Background3D.jsx
│   │       └── Gauge3D.jsx
│   ├── index.html
│   └── package.json
│
└── backend/                         # FastAPI app
    ├── main.py                      # API endpoints
    ├── anxiety_model.pkl            # Trained ML model (Git LFS)
    ├── requirements.txt
    ├── Dockerfile
    └── README.md
```

---

## 🚀 Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API runs on http://localhost:8000
# Swagger UI at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Make sure `InputSection.jsx` points to `http://127.0.0.1:8000/predict` for local development.

---

## 🎯 Features

- **AI Anxiety Classification** — Low / Moderate / High based on student's written statement
- **Animated Result Page** — Minimal mood visual with glowing emoji and level indicator
- **Personalized Suggestions** — 5 targeted coping strategies per anxiety level
- **Interactive Exercises:**
  - 🌬️ Box Breathing — animated breathing circle (4-4-4 rhythm)
  - 🧠 Progressive Muscle Relaxation (PMR) — guided tense/release per muscle group
  - 🍅 Pomodoro Timer — 25/5 focus session timer
  - 💡 Active Recall Guide — step-by-step study technique
  - ☀️ Sunlight Reset — gentle breathing with hydration reminder
- **History Dashboard** — tracks all past predictions in localStorage
- **Swagger UI** — full API documentation at `/docs`

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check message |
| POST | `/predict` | Classify anxiety level |
| GET | `/health` | Server status |

### POST `/predict`
**Request:**
```json
{
  "statement": "I have an exam tomorrow and I can't stop panicking"
}
```
**Response:**
```json
{
  "statement": "I have an exam tomorrow and I can't stop panicking",
  "anxiety_level": "High Anxiety",
  "confidence": 87.43
}
```

---

## 🔮 Future Improvements

- [ ] Retrain with Logistic Regression for better accuracy on short statements
- [ ] Add `ngram_range=(1,3)` to capture multi-word stress phrases
- [ ] Fine-tune DistilBERT on the balanced dataset for production
- [ ] Add user authentication and persistent history
- [ ] Mobile app conversion (React Native)
- [ ] Multilingual support

---

## 👨‍💻 Author
**Harsh Saxena**
vGitHub: [@harshsaxena2004](https://github.com/harshsaxena2004)
**Akshat Tahalani**
GitHub: [@akshat-tahalani](https://github.com/akshat-tahalani)
Hugging Face: [@akshattahalani](https://huggingface.co/akshattahalani)
