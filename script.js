// ==========================================
// LANGUAGE TRANSLATOR - FRONTEND JAVASCRIPT
// ==========================================


// Get HTML elements
const inputText = document.getElementById("inputText");
const translateBtn = document.getElementById("translateBtn");
const resultText = document.getElementById("resultText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const listenBtn = document.getElementById("listenBtn");
const clearBtn = document.getElementById("clearBtn");

const charCount = document.getElementById("charCount");
const status = document.getElementById("status");


// ==========================================
// CHARACTER COUNTER
// ==========================================

inputText.addEventListener("input", function () {

    charCount.textContent =
        `${inputText.value.length} / 5000`;

});


// ==========================================
// TRANSLATE
// ==========================================

translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    // Check if text is empty
    if (!text) {

        resultText.textContent =
            "Please enter some text first.";

        status.textContent = "";

        return;
    }


    // Get selected languages
    const source = sourceLanguage.value;
    const target = targetLanguage.value;


    // Same language
    if (source === target) {

        resultText.textContent = text;

        status.textContent =
            "Same language selected";

        return;
    }


    // Show loading message
    status.textContent = "Translating...";
    resultText.textContent = "Please wait...";


    try {

        // Send request to Node.js server
        const response = await fetch("/api/translate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                text: text,
                source: source,
                target: target

            })

        });


        // Convert response to JSON
        const data = await response.json();


        // Check for server error
        if (!response.ok) {

            throw new Error(
                data.error || "Translation failed"
            );

        }


        // Display translated text
        resultText.textContent =
            data.translatedText;

        status.textContent =
            "Translated successfully";


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );

        resultText.textContent =
            "Translation failed. Please try again.";

        status.textContent =
            "Error";
    }

});


// ==========================================
// SWAP LANGUAGES
// ==========================================

swapBtn.addEventListener("click", function () {

    // Save current languages
    const currentSource =
        sourceLanguage.value;

    const currentTarget =
        targetLanguage.value;


    // Swap languages
    sourceLanguage.value =
        currentTarget;

    targetLanguage.value =
        currentSource;


    // Save current text
    const currentInput =
        inputText.value;

    const currentOutput =
        resultText.textContent;


    // Swap text only if translation exists
    if (
        currentOutput &&
        currentOutput !==
        "Your translated text will appear here..." &&
        currentOutput !== "Please wait..."
    ) {

        inputText.value =
            currentOutput;

        resultText.textContent =
            currentInput;


        // Update character counter
        charCount.textContent =
            `${inputText.value.length} / 5000`;
    }


    status.textContent = "";

});


// ==========================================
// COPY TRANSLATION
// ==========================================

copyBtn.addEventListener("click", async function () {

    const text =
        resultText.textContent;


    // Nothing to copy
    if (
        !text ||
        text ===
        "Your translated text will appear here..." ||
        text === "Please wait..."
    ) {

        status.textContent =
            "Nothing to copy.";

        return;
    }


    try {

        await navigator.clipboard.writeText(text);

        status.textContent =
            "Copied!";

    } catch (error) {

        console.error(
            "Copy error:",
            error
        );

        status.textContent =
            "Copy failed.";
    }

});


// ==========================================
// TEXT TO SPEECH
// ==========================================

listenBtn.addEventListener("click", function () {

    const text =
        resultText.textContent;


    // Nothing to speak
    if (
        !text ||
        text ===
        "Your translated text will appear here..." ||
        text === "Please wait..."
    ) {

        status.textContent =
            "Nothing to listen to.";

        return;
    }


    // Stop previous speech
    window.speechSynthesis.cancel();


    // Create speech
    const speech =
        new SpeechSynthesisUtterance(text);


    // Use target language
    speech.lang =
        targetLanguage.value;


    // Speech started
    speech.onstart = function () {

        status.textContent =
            "Playing...";

    };


    // Speech finished
    speech.onend = function () {

        status.textContent =
            "Finished";

    };


    // Speech error
    speech.onerror = function () {

        status.textContent =
            "Speech error";

    };


    // Start speech
    window.speechSynthesis.speak(speech);

});


// ==========================================
// CLEAR
// ==========================================

clearBtn.addEventListener("click", function () {

    // Clear input
    inputText.value = "";


    // Reset translation
    resultText.textContent =
        "Your translated text will appear here...";


    // Reset counter
    charCount.textContent =
        "0 / 5000";


    // Clear status
    status.textContent = "";


    // Stop speech
    window.speechSynthesis.cancel();

});