"use strict";

/* ========================================
   DOM Elements
======================================== */

const questionInput = document.querySelector("#questionInput");
const askButton = document.querySelector("#askButton");
const clearButton = document.querySelector("#clearButton");

const answer = document.querySelector("#answer");
const answerStatus = document.querySelector("#answerStatus");

const characterCount = document.querySelector("#characterCount");

const themeButton = document.querySelector("#themeButton");

const quickButtons =
    document.querySelectorAll(".quick-action[data-question]");


/* ========================================
   Constants
======================================== */

const MAX_LENGTH = 1000;
const THEME_STORAGE_KEY = "ai-study-dark-mode";


/* ========================================
   Application State
======================================== */

let isLoading = false;


/* ========================================
   Utility Functions
======================================== */

/**
 * Escape user-generated text before inserting
 * it into HTML.
 */
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/**
 * Update the character counter.
 */
function updateCharacterCount() {

    const length = questionInput.value.length;

    characterCount.textContent =
        `${length} / ${MAX_LENGTH}`;
}


/**
 * Update AI status.
 */
function setAnswerStatus(status) {

    answerStatus.textContent = status;
}


/**
 * Update loading state.
 */
function setLoadingState(loading) {

    isLoading = loading;

    askButton.disabled = loading;

    clearButton.disabled = loading;

    questionInput.disabled = loading;

    if (loading) {

        askButton.innerHTML = `
            <span class="button-spinner" aria-hidden="true"></span>
            <span>Thinking...</span>
        `;

        setAnswerStatus("Thinking");

    } else {

        askButton.innerHTML = `
            <span aria-hidden="true">✨</span>
            <span>Ask AI</span>
        `;

        setAnswerStatus("Ready");
    }
}


/**
 * Display a message inside the answer area.
 */
function showMessage(message, type = "placeholder") {

    answer.innerHTML = "";

    const messageElement =
        document.createElement("div");

    messageElement.className =
        `answer-message ${type}`;

    messageElement.textContent = message;

    answer.appendChild(messageElement);
}


/* ========================================
   Ask AI
======================================== */

async function askAI() {

    if (isLoading) {
        return;
    }

    const question =
        questionInput.value.trim();


    /* Empty question */

    if (!question) {

        showMessage(
            "Please enter a question first.",
            "error"
        );

        setAnswerStatus("Waiting");

        questionInput.focus();

        return;
    }


    /* Loading */

    setLoadingState(true);


    showMessage(
        "AI is analyzing your question...",
        "loading"
    );


    /*
        Temporary AI response.

        The real AI API will be connected
        through a secure backend later.

        IMPORTANT:
        Never place an AI API key inside
        this frontend JavaScript file.
    */

    try {

        await new Promise(
            resolve => setTimeout(resolve, 800)
        );


        answer.innerHTML = `
            <div class="answer-text">

                <div class="answer-question">

                    <span class="answer-label">
                        Your question
                    </span>

                    <p>
                        ${escapeHTML(question)}
                    </p>

                </div>

                <div class="answer-response">

                    <span class="answer-label">
                        AI Tutor
                    </span>

                    <p>
                        This is currently a preview response.
                        The real AI model will be connected
                        through a secure backend API in a future version.
                    </p>

                </div>

            </div>
        `;

        setAnswerStatus("Ready");

    } catch (error) {

        console.error(
            "AI request failed:",
            error
        );

        showMessage(
            "Something went wrong. Please try again.",
            "error"
        );

        setAnswerStatus("Error");

    } finally {

        setLoadingState(false);
    }
}


/* ========================================
   Clear
======================================== */

function clearQuestion() {

    questionInput.value = "";

    updateCharacterCount();

    answer.innerHTML = `
        <div class="answer-placeholder">

            <span
                class="placeholder-icon"
                aria-hidden="true"
            >
                🤖
            </span>

            <p>
                Ask a question to start learning.
            </p>

            <span>
                Your AI tutor will explain the topic clearly and simply.
            </span>

        </div>
    `;

    setAnswerStatus("Ready");

    questionInput.focus();
}


clearButton.addEventListener(
    "click",
    clearQuestion
);


/* ========================================
   Ask Button
======================================== */

askButton.addEventListener(
    "click",
    askAI
);


/* ========================================
   Keyboard Shortcuts
======================================== */

questionInput.addEventListener(
    "keydown",
    function (event) {

        /*
            Ctrl + Enter on Windows/Linux
            Command + Enter on macOS/iOS keyboards.
        */

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            askAI();
        }
    }
);


/* ========================================
   Character Counter
======================================== */

questionInput.addEventListener(
    "input",
    updateCharacterCount
);


/* ========================================
   Quick Actions
======================================== */

quickButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (isLoading) {
                    return;
                }


                const prompt =
                    button.dataset.question;


                if (!prompt) {
                    return;
                }


                questionInput.value = prompt;

                updateCharacterCount();

                questionInput.focus();

                /*
                    Move cursor to the end
                    of the text.
                */

                questionInput.setSelectionRange(
                    questionInput.value.length,
                    questionInput.value.length
                );
            }
        );
    }
);


/* ========================================
   Theme
======================================== */

function applyTheme(isDark) {

    document.body.classList.toggle(
        "dark",
        isDark
    );


    themeButton.textContent =
        isDark ? "☀️" : "🌙";


    themeButton.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}


function toggleTheme() {

    const isDark =
        !document.body.classList.contains("dark");


    applyTheme(isDark);


    localStorage.setItem(
        THEME_STORAGE_KEY,
        String(isDark)
    );
}


themeButton.addEventListener(
    "click",
    toggleTheme
);


/* ========================================
   Load Saved Theme
======================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );


    if (savedTheme === "true") {

        applyTheme(true);

        return;
    }


    /*
        Respect the user's system preference
        if no saved preference exists.
    */

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    applyTheme(prefersDark);
}


/* ========================================
   Initialize Application
======================================== */

function initializeApp() {

    updateCharacterCount();

    loadTheme();

    setAnswerStatus("Ready");
}


initializeApp();
