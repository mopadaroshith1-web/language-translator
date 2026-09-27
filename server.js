// ==========================================
// LANGUAGE TRANSLATOR - NODE.JS SERVER
// ==========================================

const express = require("express");
const path = require("path");


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// Server port
const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

// Allow JSON data from frontend
app.use(express.json());

// Serve HTML, CSS and JavaScript files
app.use(express.static(__dirname));


// ==========================================
// TRANSLATION API
// ==========================================

app.post("/api/translate", async (req, res) => {

    try {

        // Get data sent from script.js
        const { text, source, target } = req.body;


        // Check input
        if (!text || !source || !target) {

            return res.status(400).json({
                error: "Text, source language and target language are required."
            });

        }


        // ======================================
        // MYMEMORY TRANSLATION API
        // ======================================

        const url =
            "https://api.mymemory.translated.net/get" +
            "?q=" + encodeURIComponent(text) +
            "&langpair=" + encodeURIComponent(source + "|" + target);


        // Send request to MyMemory
        const response = await fetch(url);


        // Check response
        if (!response.ok) {

            throw new Error(
                "Translation API request failed."
            );

        }


        // Convert response to JSON
        const data = await response.json();


        // Check translation
        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {

            throw new Error(
                "Translation was not returned."
            );

        }


        // ======================================
        // SEND TRANSLATION TO FRONTEND
        // ======================================

        res.json({
            translatedText:
                data.responseData.translatedText
        });


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        res.status(500).json({

            error:
                "Translation failed. Please try again."

        });

    }

});


// ==========================================
// START SERVER
// ==========================================

// 0.0.0.0 allows other devices on the
// same Wi-Fi network to access the server.

app.listen(PORT, "0.0.0.0", (error) => {

    if (error) {

        console.error(
            "Server failed to start:",
            error
        );

        return;
    }


    console.log("");
    console.log("==========================================");
    console.log("     LANGUAGE TRANSLATOR SERVER");
    console.log("==========================================");
    console.log("");
    console.log("Server started successfully!");
    console.log("");
    console.log("This computer:");
    console.log("http://localhost:3000");
    console.log("");
    console.log("For devices on the same Wi-Fi:");
    console.log(`http://${require('os').networkInterfaces().en0[0].address}:3000`);
    console.log("");
    console.log("==========================================");
    console.log("");

});