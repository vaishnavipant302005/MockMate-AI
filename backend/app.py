import os
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai


# ==========================================
# 1. LOAD ENVIRONMENT VARIABLES
# ==========================================

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-latest")


# ==========================================
# 2. INITIALIZE FLASK APP AND GEMINI
# ==========================================

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=API_KEY) if API_KEY else None


# ==========================================
# 3. HOME ROUTE
# ==========================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "MockMate AI Backend is running!"
    })


# ==========================================
# 4. HEALTH CHECK
# ==========================================

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "backend": "running",
        "gemini_configured": client is not None
    })


# ==========================================
# 5. EVALUATE INTERVIEW ANSWER WITH GEMINI
# ==========================================

@app.route("/api/evaluate", methods=["POST"])
def evaluate_answer():

    # Check whether the Gemini API key exists.
    if client is None:
        return jsonify({
            "status": "error",
            "message": (
                "Gemini API key is missing. "
                "Add GEMINI_API_KEY to backend/.env."
            )
        }), 500

    # Read and validate the request.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Please send valid JSON data."
        }), 400

    question = data.get("question", "")
    answer = data.get("answer", "")
    category = data.get("category", "General Interview")

    # Ensure the fields contain strings.
    if not all(
        isinstance(value, str)
        for value in (question, answer, category)
    ):
        return jsonify({
            "status": "error",
            "message": (
                "Question, answer, and category "
                "must be text."
            )
        }), 400

    question = question.strip()
    answer = answer.strip()
    category = category.strip() or "General Interview"

    # Check required fields.
    if not question or not answer:
        return jsonify({
            "status": "error",
            "message": (
                "Please provide both the interview "
                "question and your answer."
            )
        }), 400

    # ==========================================
    # 6. SHORT, NUMBERED FEEDBACK PROMPT
    # ==========================================

    prompt = f"""
You are a fair and practical interview evaluator.

Interview category: {category}
Interview question: {question}
Candidate's answer: {answer}

Evaluate the candidate's answer based only on its
accuracy, relevance, and completeness.

Return EXACTLY these five numbered points:

1. Score: X/10
2. Correct: One short sentence explaining what was correct.
3. Mistake: One short sentence explaining what was wrong
   or missing. If there is no major mistake, say so.
4. Improve: One direct sentence telling the candidate
   exactly what to fix.
5. Better Answer: Give one clear, interview-ready answer
   in 2-3 sentences.

STRICT RULES:
- Use simple English.
- Keep points 2, 3, and 4 to one sentence each.
- Give a score out of 10.
- Be honest and specific, not overly flattering.
- Do not write an introduction or conclusion.
- Do not use long paragraphs or extra headings.
- Do not invent facts about the candidate.
- Judge the answer against the actual question.
- If the answer is irrelevant or incorrect, explain that.
- Return only the five numbered points.
"""

    # ==========================================
    # 7. CALL GEMINI AND RETURN FEEDBACK
    # ==========================================

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        feedback = (response.text or "").strip()

        if not feedback:
            app.logger.error("Gemini returned an empty response.")

            return jsonify({
                "status": "error",
                "message": (
                    "Gemini returned empty feedback. "
                    "Please try again."
                )
            }), 502

        return jsonify({
            "status": "success",
            "question": question,
            "category": category,
            "feedback": feedback
        }), 200

    except Exception:
        app.logger.exception("Gemini evaluation failed.")

        return jsonify({
            "status": "error",
            "message": (
                "AI evaluation failed. Check the backend "
                "terminal and verify your Gemini API key "
                "and model configuration."
            )
        }), 502


# ==========================================
# 8. RUN THE BACKEND
# ==========================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
