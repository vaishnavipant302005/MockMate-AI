
document.addEventListener("DOMContentLoaded", () => {
  // Interview questions
  const questionBank = {
    "HR Interview": [
      "Tell me about yourself.",
      "What are your strengths and weaknesses?",
      "Why should we hire you?",
      "Where do you see yourself in five years?",
      "Why do you want to join our company?",
      "Describe a challenge you have faced.",
      "How do you handle pressure?",
      "Do you prefer working alone or in a team?"
    ],
    "Python Developer": [
      "What is Python and why is it popular?",
      "What is the difference between a list and a tuple?",
      "What are Python dictionaries?",
      "What is the difference between == and is?",
      "What are functions in Python?",
      "What is exception handling in Python?",
      "What is object-oriented programming?",
      "What is the difference between a for loop and a while loop?"
    ],
    "Web Developer": [
      "What is the difference between HTML, CSS and JavaScript?",
      "What is the purpose of HTML semantic elements?",
      "What is the CSS box model?",
      "What is the difference between id and class in CSS?",
      "What is the DOM in JavaScript?",
      "What is responsive web design?",
      "What is the difference between let, const and var?",
      "What happens when you submit a form on a website?"
    ],
    "Cybersecurity": [
      "What is cybersecurity?",
      "What is the CIA triad?",
      "What is phishing?",
      "What is the difference between encryption and hashing?",
      "What is a firewall?",
      "What is multi-factor authentication?",
      "What is malware?",
      "What would you do if you detected a suspicious email?"
    ],
    "Data Analyst": [
      "What does a data analyst do?",
      "What is the difference between data and information?",
      "What is SQL used for?",
      "What is the difference between WHERE and HAVING in SQL?",
      "What is data cleaning?",
      "What is the difference between Excel and SQL?",
      "What is a primary key in a database?",
      "How would you explain data insights to a non-technical person?"
    ]
  };

  const $ = (id) => document.getElementById(id);

  const panel = $("interviewPanel");
  const title = $("interviewTitle");
  const questionText = $("questionText");
  const questionProgress = $("questionProgress");
  const progressFill = $("progressFill");
  const answerInput = $("candidateAnswer");
  const feedbackBox = $("feedbackBox");
  const submitButton = $("submitAnswer");
  const previousButton = $("previousQuestion");
  const micButton = $("micButton");
  const micStatus = $("micStatus");

  // Keep completed statistics after page refresh
  const STORAGE_KEY = "mockmateStatistics";

  function readStatistics() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        answers: Number(saved?.answers) || 0,
        interviews: Number(saved?.interviews) || 0,
        dates: Array.isArray(saved?.dates) ? saved.dates : []
      };
    } catch {
      return { answers: 0, interviews: 0, dates: [] };
    }
  }

  const stats = readStatistics();

  // Session data
  const state = {
    role: "",
    index: 0,
    answers: {},
    submitted: {},
    feedback: {},
    completedRoles: {}
  };

  function questionKey(role = state.role, index = state.index) {
    return `${role}-${index}`;
  }

  function getQuestions() {
    return questionBank[state.role] || [];
  }

  function countAnsweredThisSession() {
    return Object.values(state.submitted).filter(Boolean).length;
  }

  function getStreak() {
    const dateSet = new Set(stats.dates);
    const today = new Date();
    let streak = 0;

    while (true) {
      const date = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
      ].join("-");

      if (!dateSet.has(date)) break;

      streak++;
      today.setDate(today.getDate() - 1);
    }

    return streak;
  }

  function saveStatistics() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  function updateDashboard() {
    const interviewCount = $("interviewCount");
    const answerCount = $("answerCount");
    const streakCount = $("streakCount");

    if (interviewCount) {
      interviewCount.textContent = stats.interviews;
    }

    if (answerCount) {
      answerCount.textContent = stats.answers;
    }

    if (streakCount) {
      streakCount.textContent = `${getStreak()} days`;
    }

    const progressMessage = $("progressMessage");
    const progressPercent = $("progressPercent");
    const overallProgressFill = $("overallProgressFill");

    if (progressMessage) {
      progressMessage.textContent = stats.answers
        ? `You have submitted ${stats.answers} answer(s). Keep practicing!`
        : "Complete your first practice answer to begin tracking your progress.";
    }

    const percent = Math.min(100, Math.round((stats.answers / 40) * 100));

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }

    if (overallProgressFill) {
      overallProgressFill.style.width = `${percent}%`;
    }
  }

  function recordSuccessfulAnswer() {
    stats.answers++;

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (!stats.dates.includes(date)) {
      stats.dates.push(date);
    }

    saveStatistics();
    updateDashboard();
  }

  function showFeedback(message, heading = "Interview Feedback") {
    if (!feedbackBox) return;

    feedbackBox.classList.remove("hidden");
    feedbackBox.replaceChildren();

    const headingElement = document.createElement("strong");
    headingElement.textContent = heading;

    const content = document.createElement("p");
    content.textContent = message;

    feedbackBox.append(headingElement, content);
  }

  // Display current question
  function renderQuestion() {
    const questions = getQuestions();

    if (!questions.length || !answerInput) return;

    const key = questionKey();
    const submitted = Boolean(state.submitted[key]);

    if (title) title.textContent = state.role;

    if (questionText) {
      questionText.textContent = questions[state.index];
    }

    if (questionProgress) {
      questionProgress.textContent =
        `Question ${state.index + 1} of ${questions.length}`;
    }

    if (progressFill) {
      progressFill.style.width =
        `${((state.index + 1) / questions.length) * 100}%`;
    }

    answerInput.value = state.answers[key] || "";
    answerInput.disabled = submitted;

    if (previousButton) {
      previousButton.disabled = state.index === 0;
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = submitted
        ? state.index === questions.length - 1
          ? "Finish Interview ✓"
          : "Next Question →"
        : "Submit Answer →";
    }

    if (submitted) {
      showFeedback(
        state.feedback[key] || "Your answer was evaluated successfully.",
        "Gemini AI Interview Feedback"
      );
    } else if (feedbackBox) {
      feedbackBox.textContent = "";
      feedbackBox.classList.add("hidden");
    }

    if (micStatus) {
      micStatus.textContent = "Click the microphone to answer by voice.";
    }

    updateDashboard();
  }

  // Start an interview
  function startInterview(role) {
    if (!questionBank[role]) {
      alert("Please select a valid interview category.");
      return;
    }

    state.role = role;
    state.index = 0;

    if (panel) {
      panel.classList.remove("hidden");
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderQuestion();
  }

  // Connect to the Flask and Gemini backend
  async function getGeminiFeedback(question, answer, category) {
    const response = await fetch("http://127.0.0.1:5000/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, category })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("The backend returned an invalid response.");
    }

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "AI evaluation failed.");
    }

    if (!data.feedback) {
      throw new Error("No feedback was returned by the AI.");
    }

    return data.feedback;
  }

  // Submit answer or move to the next question
  async function submitAnswer() {
    if (!state.role || !answerInput || !submitButton) return;

    const questions = getQuestions();
    const key = questionKey();

    if (state.submitted[key]) {
      if (state.index < questions.length - 1) {
        state.index++;
        renderQuestion();
      } else {
        // Count each completed category only once
        if (!state.completedRoles[state.role]) {
          state.completedRoles[state.role] = true;
          stats.interviews++;
          saveStatistics();
        }

        updateDashboard();

        alert(`Interview completed!\nCategory: ${state.role}`);

        if (panel) panel.classList.add("hidden");

        const dashboard = $("dashboard");
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      return;
    }

    const answer = answerInput.value.trim();

    if (!answer) {
      alert("Please write or speak your answer first.");
      answerInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Evaluating with AI...";

    showFeedback("Please wait while Gemini evaluates your answer.", "AI Evaluation");

    try {
      const feedback = await getGeminiFeedback(
        questions[state.index],
        answer,
        state.role
      );

      state.answers[key] = answer;
      state.submitted[key] = true;
      state.feedback[key] = feedback;

      recordSuccessfulAnswer();
      renderQuestion();

    } catch (error) {
      console.error("AI evaluation error:", error);

      showFeedback(
        `${error.message}\n\nCheck that Flask is running and try again.`,
        "AI Evaluation Failed"
      );

      submitButton.textContent = "Try Again";

    } finally {
      submitButton.disabled = false;
    }
  }

  // Previous question
  function goToPreviousQuestion() {
    if (!state.role || state.index <= 0) return;

    const key = questionKey();

    if (!state.submitted[key] && answerInput) {
      state.answers[key] = answerInput.value;
    }

    state.index--;
    renderQuestion();
  }

  // Exit interview
  function exitInterview() {
    if (state.role && answerInput) {
      const key = questionKey();

      if (!state.submitted[key]) {
        state.answers[key] = answerInput.value;
      }
    }

    if (panel) panel.classList.add("hidden");

    const dashboard = $("dashboard");
    if (dashboard) {
      dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Category buttons
  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      startInterview(button.dataset.role);
    });
  });

  if (submitButton) {
    submitButton.addEventListener("click", submitAnswer);
  }

  if (previousButton) {
    previousButton.addEventListener("click", goToPreviousQuestion);
  }

  const exitButton = $("exitInterview");
  if (exitButton) {
    exitButton.addEventListener("click", exitInterview);
  }

  // Sidebar navigation
  const menuToggle = $("menuToggle");
  const sidebar = $("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");

      document.querySelectorAll(".nav-link").forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");

      const targetId = link.dataset.page || link.dataset.target;
      const target = targetId ? $(targetId) : null;

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Voice input
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (micButton) {
    if (!SpeechRecognition) {
      micButton.addEventListener("click", () => {
        if (micStatus) {
          micStatus.textContent =
            "Speech recognition is unavailable. Please use Chrome.";
        }
      });
    } else {
      const recognition = new SpeechRecognition();

      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      let listening = false;
      let finalTranscript = "";

      recognition.onstart = () => {
        listening = true;
        micButton.textContent = "Stop Speaking";

        if (micStatus) micStatus.textContent = "Listening...";
      };

      recognition.onresult = (event) => {
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (answerInput) {
          answerInput.value = (finalTranscript + interim).trim();
        }
      };

      recognition.onerror = (event) => {
        if (micStatus) {
          micStatus.textContent = `Microphone error: ${event.error}`;
        }
      };

      recognition.onend = () => {
        listening = false;
        micButton.textContent = "🎤 Speak Answer";

        if (micStatus && !micStatus.textContent.startsWith("Microphone error")) {
          micStatus.textContent = "Speech input stopped.";
        }
      };

      micButton.addEventListener("click", () => {
        if (!state.role) {
          alert("Select an interview category first.");
          return;
        }

        if (!answerInput || answerInput.disabled) return;

        if (listening) {
          recognition.stop();
          return;
        }

        finalTranscript = answerInput.value.trim()
          ? answerInput.value.trim() + " "
          : "";

        try {
          recognition.start();
        } catch (error) {
          console.error("Could not start microphone:", error);

          if (micStatus) {
            micStatus.textContent = "Please try starting the microphone again.";
          }
        }
      });
    }
  }

  // Initial dashboard values
  if (panel) panel.classList.add("hidden");
  updateDashboard();
});

