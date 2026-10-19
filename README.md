# MockMate AI – AI-Powered Mock Interview System

MockMate AI is a web-based mock interview practice system designed to help students improve their interview preparation, confidence, and communication skills. It provides role-based interview questions and AI-generated feedback on submitted answers using the Gemini AI API.

The project uses a web frontend and a Python Flask backend to process interview answers and return feedback.

## Features

- **Role-Based Interview Practice:** Practise for Web Developer, Python Developer, HR Interview, Cybersecurity, and Data Analyst roles.
- **AI-Powered Feedback:** Submit answers and receive feedback generated through the Gemini AI API.
- **Question Navigation:** Move between interview questions and review your answers.
- **Progress Tracking:** Display interview practice statistics and submitted-answer counts.
- **Voice Input:** Use browser speech recognition when supported by the browser.
- **Simple User Interface:** Navigate between dashboard, practice, and progress sections.

## Technology Stack

| Component             | Technology            |
| --------------------- | --------------------- |
| Frontend              | HTML, CSS, JavaScript |
| Backend               | Python, Flask         |
| AI Integration        | Google Gemini API     |
| Cross-Origin Requests | Flask-CORS            |
| Configuration         | python-dotenv         |
| Version Control       | Git and GitHub        |

## Architecture

The application follows a frontend-backend architecture.

1. The user selects an interview category.
2. The frontend displays a question.
3. The user types an answer or uses voice input if available.
4. The frontend sends the question, answer, and category to the Flask backend.
5. The backend requests AI-generated feedback from Gemini.
6. The feedback is returned to the frontend and displayed to the user.
7. Practice statistics are tracked by the frontend.

## Project Structure

```text
software-exhibition/
├── backend/
│   └── app.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── .gitignore
├── .gitignore
└── README.md
```

The structure above lists the main application files. Additional local configuration files may exist in the development environment.

## Prerequisites

- Python 3.10 or a compatible version supported by the installed dependencies
- pip
- A modern web browser
- A Google Gemini API key
- Git (optional for running locally, required for Git-based version control)

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/vaishnavipant302005/MockMate-AI.git
cd MockMate-AI
```

### 2. Create and activate a virtual environment

On Windows PowerShell:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, follow your system's Python environment setup guidance or use Command Prompt activation instead.

### 3. Install backend dependencies

Install the packages used by the backend:

```bash
python -m pip install flask flask-cors python-dotenv google-genai
```

### 4. Configure the Gemini API key

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own API key. Never commit or publish this file.

### 5. Start the backend

From the project root, run:

```powershell
python backend/app.py
```

If your Flask application is configured to run through a different entry point, use the corresponding command from your backend setup.

### 6. Open the frontend

Open `frontend/index.html` in your browser, or use the Live Server extension in VS Code.

Ensure the frontend's API request points to the address and port used by your running Flask backend.

## Configuration and Security

- Keep API keys in environment variables and never publish them in source code.
- The `.gitignore` file should exclude `.env` files and virtual environments.
- Keep development debug mode disabled in production.
- Do not expose the development server directly to the public internet.
- AI-generated feedback is intended to support practice and should be reviewed critically.

## Testing

Test the following functionality before presenting the project:

- Interview categories and question navigation.
- Answer submission and Gemini feedback.
- Error handling when the API key is missing or the AI service fails.
- Dashboard statistics and progress display.
- Voice input in a supported browser.
- Frontend-backend communication.

## Limitations

- AI feedback depends on Gemini API availability and configuration.
- Voice input depends on browser support and microphone permissions.
- A persistent database and user authentication should be documented as available only if they have actually been implemented.
- Statistics stored in browser local storage are specific to that browser and device.

## Future Enhancements

- MySQL or SQLite database for persistent interview history.
- User registration and secure login.
- Interview scoring and detailed performance reports.
- Resume-based interview questions.
- Additional job roles and difficulty levels.
- Improved accessibility and mobile responsiveness.

## Project Information

**Project Name:** MockMate AI – AI-Powered Mock Interview System
**Project Type:** Web Application
**Purpose:** Interview preparation and practice
**Developer:** Vaishnavi Pant
**GitHub Repository:** [https://github.com/vaishnavipant302005/MockMate-AI](https://github.com/vaishnavipant302005/MockMate-AI)

## Acknowledgement

This project was developed as a learning initiative to explore web development, backend programming, and AI integration for interview preparation.
