import { ElevenLabsClient } from "elevenlabs";

// Create a client for elevenlabs
export const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
