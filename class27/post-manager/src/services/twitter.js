import { TwitterApi } from "twitter-api-v2";
import { API_KEY, API_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET } from "./ssh.js";
import { Buffer } from 'buffer';

window.Buffer = Buffer;

console.log("API_KEY", API_KEY);
const client = new TwitterApi({
    appKey: API_KEY,
    appSecret: API_SECRET_KEY,
    accessToken: ACCESS_TOKEN,
    accessSecret: ACCESS_TOKEN_SECRET,
});


// Ensure the TwitterApi class is properly imported and used
if (!TwitterApi) {
    console.error("TwitterApi is undefined. Please check your 'twitter-api-v2' installation.");
} else {
    console.log("TwitterApi is loaded successfully.");
}

export async function postTweet(text) {
    try {
      const tweet = await client.v2.tweet(text);
      console.log("Tweet posted successfully:", tweet);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  }




