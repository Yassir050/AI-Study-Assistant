const questionInput =
    document.querySelector("#questionInput");

const askButton =
    document.querySelector("#askButton");

const clearButton =
    document.querySelector("#clearButton");

const answer =
    document.querySelector("#answer");

const themeButton =
    document.querySelector("#themeButton");

const quickButtons =
    document.querySelectorAll("[data-question]");


// -------------------------
// Ask AI
// -------------------------

function askAI() {

    const question =
        questionInput.value.trim();


    if (question === "") {

        answer.innerHTML = `
            <p class="placeholder">
                Please enter a question first.
            </p>
        `;

        return;
    }


    answer.innerHTML = `
        <p class="loading">
            🤖 AI is thinking...
        </p>
    `;


    askButton.disabled = true;


    // Temporary response
    // Real AI API will be connected later.

    setTimeout(function () {

        answer.innerHTML = `
            <div class="answer-text">
                <strong>Question:</strong>

                ${escapeHTML(question)}

                <br><br>

                This is the AI Study Assistant interface.

                The real AI model will be connected
                in the next version using a secure backend API.
            </div>
        `;

        askButton.disabled = false;

    }, 800);
}


// -------------------------
// Clear
// -------------------------

clearButton.addEventListener(
    "click",
    function () {

        questionInput.value = "";

        answer.innerHTML = `
            <p class="placeholder">
                Your AI answer will appear here.
            </p>
        `;

        questionInput.focus();
    }
);


// -------------------------
// Ask Button
// -------------------------

askButton.addEventListener(
    "click",
    askAI
);


// -------------------------
// Enter shortcut
// -------------------------

questionInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            event.ctrlKey
        ) {

            askAI();
        }
    }
);


// -------------------------
// Quick Actions
// -------------------------

quickButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                questionInput.value =
                    button.dataset.question;

                questionInput.focus();
            }
        );
    }
);


// -------------------------
// Dark Mode
// -------------------------

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "ai-study-dark-mode",
            darkMode
        );


        themeButton.textContent =
            darkMode ? "☀️" : "🌙";
    }
);


// -------------------------
// Load Theme
// -------------------------

const savedTheme =
    localStorage.getItem(
        "ai-study-dark-mode"
    );


if (savedTheme === "true") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";
}


// -------------------------
// Security helper
// -------------------------

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
