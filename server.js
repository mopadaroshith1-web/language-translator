// ==========================================
// LANGUAGE TRANSLATOR - NODE.JS SERVER
// ==========================================

const express = require("express");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// Render provides PORT automatically.
// 3000 is used when running locally.
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// Serve index.html, style.css and script.js
app.use(express.static(__dirname));

// ==========================================
// TRANSLATION API
// ==========================================

app.post("/api/translate", async (req, res) => {
    try {
        // Get data from frontend
        const { text, source, target } = req.body;

        // Validate input
        if (!text || !source || !target) {
            return res.status(400).json({
                error: "Text, source language and target language are required."
            });
        }

        // MyMemory Translation API
        const url =
            "https://api.mymemory.translated.net/get" +
            "?q=" + encodeURIComponent(text) +
            "&langpair=" + encodeURIComponent(source + "|" + target);

        // Request translation
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation API request failed.");
        }

        // Convert response to JSON
        const data = await response.json();

        // Check translation result
        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error("Translation was not returned.");
        }

        // Send translation to frontend
        res.json({
            translatedText: data.responseData.translatedText
        });

    } catch (error) {
        console.error("Translation error:", error);

        res.status(500).json({
            error: "Translation failed. Please try again."
        });
    }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
    console.log("==========================================");
    console.log("     LANGUAGE TRANSLATOR SERVER");
    console.log("==========================================");
    console.log(`Server running on port ${PORT}`);
    console.log("==========================================");
});