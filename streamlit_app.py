import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000/predict"  # change if deployed

# ── Page config ──────────────────────────────────────────
st.set_page_config(page_title="Anxiety Level Detector", page_icon="🧠")
st.title("🧠 Student Anxiety Level Detector")
st.markdown("Enter a student's statement below to predict their anxiety level.")

# ── Input ─────────────────────────────────────────────────
statement = st.text_area("Student Statement", placeholder="e.g. I can't sleep and feel overwhelmed with exams...")

if st.button("Predict"):
    if not statement.strip():
        st.warning("Please enter a statement first.")
    else:
        with st.spinner("Analyzing..."):
            try:
                response = requests.post(API_URL, json={"statement": statement})
                result = response.json()

                level = result["anxiety_level"]
                confidence = result["confidence"]

                # ── Color code the result ──────────────────
                if "High" in level:
                    st.error(f"🔴 **{level}** — Confidence: {confidence}%")
                elif "Moderate" in level:
                    st.warning(f"🟡 **{level}** — Confidence: {confidence}%")
                else:
                    st.success(f"🟢 **{level}** — Confidence: {confidence}%")

                # ── Progress bar for confidence ────────────
                st.progress(confidence / 100)

            except Exception as e:
                st.error(f"Could not connect to backend: {e}")
                st.info("Make sure FastAPI is running on port 8000")
```

