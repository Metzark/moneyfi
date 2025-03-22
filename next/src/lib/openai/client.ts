import { OpenAI } from "openai";

// Create a client for openai
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
