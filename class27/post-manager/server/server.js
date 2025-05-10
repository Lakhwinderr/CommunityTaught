import express from "express";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"; // Import multer for handling file uploads
import axios from "axios";
import querystring from "querystring"; // Import querystring for URL encoding


// Import necessary modules and libraries
// express: Web framework for building APIs
// twitter-api-v2: Library to interact with Twitter API
// dotenv: Loads environment variables from a .env file
// cors: Middleware to enable Cross-Origin Resource Sharing
// multer: Middleware for handling multipart/form-data, primarily used for file uploads
// axios: Promise-based HTTP client for the browser and Node.js, axios: To make HTTP requests to LinkedIn's API

dotenv.config(); // Load environment variables from a .env file

const app = express(); // Initialize an Express application
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)


// Initialize Twitter API client with credentials from environment variables
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY, // Twitter API key
    appSecret: process.env.TWITTER_API_SECRET, // Twitter API secret
    accessToken: process.env.TWITTER_ACCESS_TOKEN, // Twitter access token
    accessSecret: process.env.TWITTER_ACCESS_SECRET, // Twitter access secret
});

// Configure multer for handling file uploads
// 'dest' specifies the directory where uploaded files will be temporarily stored
const upload = multer({ dest: "uploads/" });

// Endpoint to upload media
app.post("/upload", upload.single("media"), async (req, res) => {
  try {
    // Get the file path of the uploaded file
    const filePath = req.file.path;

    // Determine the media type based on the file's MIME type
    // If the file is a video, set the type to "video/mp4"
    // Otherwise, set it to "image/jpeg"
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file details:", req.file); // Log file details for debugging

    // Check if the uploaded file is in AVIF format
    if (req.file.mimetype === "image/avif") {
        return res.status(400).json({ error: "AVIF format is not supported" });
    }

    // Upload the media file to Twitter
    const mediaId = await twitterClient.v1.uploadMedia(filePath, {
        mimeType: req.file.mimetype,
        longVideo: req.file.mimetype === "video/mp4" ? true : undefined,
    });
    // Upload the media file to Twitter and get the media ID

    // Respond with a success message and the media ID
    res.json({ success: true, mediaId });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Error uploading media:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to post a tweet
app.post("/tweet", async (req, res) => {
    try {
        // Extract the tweet text and optional mediaId from the request body
        const { text, mediaId } = req.body;

        // Log the received tweet text and mediaId for debugging
        console.log("Received tweet text:", text, "Media ID:", mediaId);

        // Prepare the payload for the tweet
        const payload = mediaId ? { text, media: { media_ids: [mediaId] } } : { text };

        // Post the tweet using the Twitter API
        const tweet = await twitterClient.v2.tweet(payload);

        // Respond with a success message and the tweet details
        console.log("Tweet posted successfully:", tweet); // FIXED LOGGING

        res.json({ success: true, tweet });
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.log("Error posting tweet:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the backend server
const PORT = process.env.PORT || 5000; // Use the port from environment variables or default to 5000

// Root endpoint to check if the server is running
app.get("/", (req, res) => {
    res.send("Server is running!");
});




//linkedin post endpoint
// Endpoint to post a LinkedIn post
app.post("/linkedin/post", async (req, res) => {
    try {
        // Extract the post content from the request body
        const { content } = req.body;

        // Log the received content for debugging
        console.log("Received LinkedIn post content:", content);

        // Check if content is provided
        if (!content) {
            return res.status(400).json({ error: "Content is required to create a LinkedIn post" });
        }

        // Define the LinkedIn API endpoint for creating a post
        const linkedInPostUrl = "https://api.linkedin.com/v2/ugcPosts";

        // Prepare the payload for the LinkedIn post
        const payload = {
            author: `urn:li:person:${process.env.LINKEDIN_PERSON_URN}`, // Replace with your LinkedIn person URN
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: content,
                    },
                    shareMediaCategory: "NONE",
                },
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            },
        };

        // Make a POST request to LinkedIn API to create the post
        const response = await axios.post(linkedInPostUrl, payload, {
            headers: {
                Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`, // Use the LinkedIn access token
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
        });

        // Log the response from LinkedIn API for debugging
        console.log("LinkedIn post created successfully:", response.data);

        // Respond with a success message and the LinkedIn post details
        res.json({ success: true, linkedInPost: response.data });
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error creating LinkedIn post:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});


// Start listening on the specified port
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  }).on("error", (err) => {
    // Log any server errors
    console.error("Server error:", err);
  });


